import "server-only";

import path from "node:path";

import { asArray, asString, readMarkdownDirectory } from "@/lib/content/readMarkdownDirectory";

import type {
  OfficeCertification,
  OfficeContent,
  OfficeProject,
  OfficeResource,
  OfficeResourceCategory,
} from "../types";

const CONTENT_ROOT = path.join(process.cwd(), "src", "features", "office", "content");

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
      readMarkdownDirectory(path.join(CONTENT_ROOT, "projects")),
      readMarkdownDirectory(path.join(CONTENT_ROOT, "certifications")),
      readMarkdownDirectory(path.join(CONTENT_ROOT, "resources")),
    ]);

    const projects: OfficeProject[] = projectFiles.map(({ id, data, body }) => ({
      id,
      title: asString(data.title),
      description: asString(data.description),
      tags: asArray(data.tags),
      detail: body,
    }));

    const certifications: OfficeCertification[] = certificationFiles.map(({ id, data }) => ({
      id,
      title: asString(data.title),
      issuer: asString(data.issuer),
      year: asString(data.year),
      summary: asString(data.summary),
    }));

    const resources: OfficeResourceCategory[] = resourceFiles.map(({ id, data, body }) => ({
      id,
      title: asString(data.title) || id,
      resources: parseResources(body),
    }));

    return { projects, certifications, resources };
  },
};
