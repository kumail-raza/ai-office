import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { parseFrontmatter } from "@/knowledge/KnowledgeLoader";

export interface MarkdownFile {
  id: string;
  data: Record<string, string | string[]>;
  body: string;
}

/**
 * Reads every markdown file in a directory and parses its frontmatter. Shared
 * by feature-level content loaders (office, recruiter, ...) so the read+parse
 * step is written once, not duplicated per feature.
 */
export async function readMarkdownDirectory(dir: string): Promise<MarkdownFile[]> {
  const entries = await readdir(dir);
  const files = entries.filter((entry) => entry.endsWith(".md"));

  return Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(dir, file), "utf8");
      const { data, body } = parseFrontmatter(raw);
      return { id: file.replace(/\.md$/, ""), data, body };
    }),
  );
}

export function asString(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export function asArray(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  return typeof value === "string" && value.length > 0 ? [value] : [];
}

export function asBoolean(value: string | string[] | undefined): boolean {
  return asString(value).toLowerCase() === "true";
}
