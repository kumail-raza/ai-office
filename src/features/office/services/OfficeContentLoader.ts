import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { parseFrontmatter } from "@/knowledge/KnowledgeLoader";

import type {
  OfficeCertification,
  OfficeContent,
  OfficeProject,
  OfficeResource,
  OfficeResourceCategory,
} from "../types";

const CONTENT_ROOT = path.join(process.cwd(), "src", "features", "office", "content");

function asString(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

function asArray(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  return typeof value === "string" && value.length > 0 ? [value] : [];
}

async function readCategory(category: string): Promise<Array<{ id: string; raw: string }>> {
  const dir = path.join(CONTENT_ROOT, category);
  const entries = await readdir(dir);
  return Promise.all(
    entries
      .filter((entry) => entry.endsWith(".md"))
      .map(async (entry) => ({
        id: entry.replace(/\.md$/, ""),
        raw: await readFile(path.join(dir, entry), "utf8"),
      })),
  );
}

function parseResources(body: string): OfficeResource[] {
  return [...body.matchAll(/^-\s+\*\*(.+?)\*\*\s*—\s*(.+)$/gm)].map((match) => ({
    title: match[1].trim(),
    description: match[2].trim(),
  }));
}

/**
 * Reads office experience content from markdown, reusing the knowledge layer's
 * frontmatter parser. Pure filesystem + text work; the Knowledge Brain itself is
 * not modified.
 */
export const OfficeContentLoader = {
  async load(): Promise<OfficeContent> {
    const [projectFiles, certificationFiles, resourceFiles] = await Promise.all([
      readCategory("projects"),
      readCategory("certifications"),
      readCategory("resources"),
    ]);

    const projects: OfficeProject[] = projectFiles.map(({ id, raw }) => {
      const { data, body } = parseFrontmatter(raw);
      return {
        id,
        title: asString(data.title),
        description: asString(data.description),
        tags: asArray(data.tags),
        detail: body,
      };
    });

    const certifications: OfficeCertification[] = certificationFiles.map(({ id, raw }) => {
      const { data } = parseFrontmatter(raw);
      return {
        id,
        title: asString(data.title),
        issuer: asString(data.issuer),
        year: asString(data.year),
        summary: asString(data.summary),
      };
    });

    const resources: OfficeResourceCategory[] = resourceFiles.map(({ id, raw }) => {
      const { data, body } = parseFrontmatter(raw);
      return {
        id,
        title: asString(data.title) || id,
        resources: parseResources(body),
      };
    });

    return { projects, certifications, resources };
  },
};
