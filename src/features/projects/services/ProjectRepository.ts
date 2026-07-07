import "server-only";

import path from "node:path";

import { asArray, asString, readMarkdownDirectory } from "@/lib/content/readMarkdownDirectory";
import { parseBulletList, splitSubsections, splitTopSections } from "@/lib/content/markdownSections";

import { type Project, type ProjectImage, type ProjectLink, ProjectStatus } from "../types";

const CONTENT_ROOT = path.join(process.cwd(), "src", "features", "projects", "content");

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseImages(value: string | string[] | undefined): ProjectImage[] {
  return asArray(value)
    .map((entry) => entry.split("|").map((part) => part.trim()))
    .filter((parts): parts is [string, string] => parts.length === 2)
    .map(([src, alt]) => ({ src, alt }));
}

function parseLinks(value: string | string[] | undefined): ProjectLink[] {
  return asArray(value)
    .map((entry) => entry.split("|").map((part) => part.trim()))
    .filter((parts): parts is [string, string] => parts.length === 2)
    .map(([label, url]) => ({ label, url }));
}

function parseStatus(value: string | string[] | undefined): ProjectStatus {
  const raw = asString(value);
  return Object.values(ProjectStatus).includes(raw as ProjectStatus)
    ? (raw as ProjectStatus)
    : ProjectStatus.Completed;
}

function buildProject(id: string, data: Record<string, string | string[]>, body: string): Project {
  const sections = splitTopSections(body);

  const architectureBody = sections.get("Architecture") ?? "";
  const architecture = splitSubsections(architectureBody).map((subsection, index) => ({
    id: slugifyTitle(subsection.title) || `section-${index}`,
    title: subsection.title,
    content: subsection.content,
  }));

  return {
    id,
    slug: asString(data.slug) || id,
    title: asString(data.title),
    summary: asString(data.summary),
    description: sections.get("Overview") ?? "",
    role: asString(data.role),
    company: asString(data.company),
    startDate: asString(data.startDate),
    endDate: asString(data.endDate),
    status: parseStatus(data.status),
    technologies: asArray(data.technologies),
    architecture,
    challenges: parseBulletList(sections.get("Challenges") ?? ""),
    solutions: parseBulletList(sections.get("Solutions") ?? ""),
    businessImpact: asString(data.businessImpact),
    lessonsLearned: parseBulletList(sections.get("Lessons Learned") ?? ""),
    images: parseImages(data.images),
    links: parseLinks(data.links),
  };
}

/**
 * Loads project entities from markdown — one file per project, frontmatter for
 * structured fields, "## Heading" sections for narrative content. Reuses the
 * shared directory reader and the knowledge layer's frontmatter parser; the
 * Knowledge Brain itself is not modified.
 */
export const ProjectRepository = {
  async getAll(): Promise<Project[]> {
    const files = await readMarkdownDirectory(CONTENT_ROOT);
    return files.map(({ id, data, body }) => buildProject(id, data, body));
  },

  async getBySlug(slug: string): Promise<Project | undefined> {
    const all = await this.getAll();
    return all.find((project) => project.slug === slug);
  },
};
