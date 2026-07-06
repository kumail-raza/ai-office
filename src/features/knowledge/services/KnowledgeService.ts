import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import type { KnowledgeDocument, KnowledgeIndex } from "../types";

const KNOWLEDGE_ROOT = path.join(process.cwd(), "knowledge");
const isProduction = process.env.NODE_ENV === "production";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with",
  "is", "are", "was", "were", "be", "been", "at", "by", "as", "it", "its", "i",
  "you", "your", "my", "me", "we", "our", "that", "this", "these", "those",
  "from", "into", "about", "how", "what", "which", "who", "do", "does", "can",
]);

let cachedIndex: KnowledgeIndex | null = null;

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(
    (token) => token.length > 1 && !STOPWORDS.has(token),
  );
}

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectMarkdownFiles(fullPath);
      return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
    }),
  );
  return files.flat();
}

async function toDocument(filePath: string): Promise<KnowledgeDocument> {
  const raw = (await readFile(filePath, "utf8")).trim();
  const relative = path.relative(KNOWLEDGE_ROOT, filePath).split(path.sep).join("/");
  const heading = raw.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const parent = path.dirname(relative);

  return {
    id: relative.replace(/\.md$/, ""),
    path: relative,
    title: heading ?? path.basename(relative, ".md"),
    category: parent === "." ? "general" : parent,
    content: raw,
    tokens: tokenize(raw),
  };
}

function buildIndex(documents: KnowledgeDocument[]): KnowledgeIndex {
  const documentFrequency = new Map<string, number>();
  for (const document of documents) {
    for (const term of new Set(document.tokens)) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }

  const total = documents.length || 1;
  const idf: Record<string, number> = {};
  for (const [term, frequency] of documentFrequency) {
    idf[term] = Math.log(1 + (total - frequency + 0.5) / (frequency + 0.5));
  }

  const averageLength =
    documents.reduce((sum, document) => sum + document.tokens.length, 0) / total;

  return { documents, idf, averageLength };
}

/**
 * Loads and indexes the markdown knowledge base. Pure filesystem + text work —
 * no model- or provider-specific code. Cached in production; re-read on every
 * call in development so edits to the markdown hot-reload without a restart.
 */
export const KnowledgeService = {
  async getIndex(): Promise<KnowledgeIndex> {
    if (isProduction && cachedIndex) return cachedIndex;

    const files = await collectMarkdownFiles(KNOWLEDGE_ROOT);
    const documents = await Promise.all(files.map(toDocument));
    const index = buildIndex(documents.filter((document) => document.content.length > 0));

    cachedIndex = index;
    return index;
  },

  tokenize,
};
