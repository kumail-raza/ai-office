import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { repeat, tokenize } from "./text";
import type { KnowledgeDocument, KnowledgeMetadata } from "./types";

const KNOWLEDGE_ROOT = path.join(process.cwd(), "src", "knowledge");

interface ParsedMarkdown {
  data: Record<string, string | string[]>;
  body: string;
}

/** Minimal, dependency-free frontmatter parser (pure — unit-test friendly). */
export function parseFrontmatter(raw: string): ParsedMarkdown {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw.trim() };

  const data: Record<string, string | string[]> = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([\w-]+):\s*(.*)$/);
    if (!pair) continue;
    const [, key, rawValue] = pair;
    const value = rawValue.trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((entry) => entry.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
    } else {
      data[key] = value.replace(/^['"]|['"]$/g, "");
    }
  }

  return { data, body: match[2].trim() };
}

export function extractHeadings(body: string): string[] {
  return [...body.matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => match[1].trim());
}

function asString(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asArray(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.length > 0) return [value];
  return [];
}

async function collectMarkdown(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectMarkdown(fullPath);
      return Promise.resolve(entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : []);
    }),
  );
  return nested.flat();
}

function buildDocument(relativePath: string, raw: string): KnowledgeDocument {
  const { data, body } = parseFrontmatter(raw);
  const headings = extractHeadings(body);
  const folder = path.dirname(relativePath).split(path.sep)[0];

  const metadata: KnowledgeMetadata = {
    title: asString(data.title) ?? headings[0] ?? path.basename(relativePath, ".md"),
    category: asString(data.category) ?? (folder === "." ? "general" : folder),
    tags: asArray(data.tags),
    headings,
    summary: asString(data.summary),
  };

  // Weight metadata terms above body terms for better retrieval.
  const tokens = [
    ...repeat(tokenize(metadata.title), 3),
    ...repeat(tokenize(metadata.tags.join(" ")), 3),
    ...repeat(tokenize(headings.join(" ")), 2),
    ...tokenize(body),
  ];

  return {
    id: relativePath.replace(/\.md$/, "").split(path.sep).join("/"),
    path: relativePath.split(path.sep).join("/"),
    metadata,
    content: body,
    tokens,
  };
}

/**
 * Loads every markdown document under `src/knowledge`, parsing frontmatter and
 * extracting title, headings, tags, and metadata. Pure filesystem + text work —
 * no provider or model code.
 */
export const KnowledgeLoader = {
  async load(): Promise<KnowledgeDocument[]> {
    const files = await collectMarkdown(KNOWLEDGE_ROOT);
    const documents = await Promise.all(
      files.map(async (file) => {
        const raw = await readFile(file, "utf8");
        return buildDocument(path.relative(KNOWLEDGE_ROOT, file), raw);
      }),
    );
    return documents.filter((document) => document.content.length > 0);
  },
};
