import "server-only";

import path from "node:path";

import { asArray, asBoolean, asString, readMarkdownDirectory } from "@/lib/content/readMarkdownDirectory";

import {
  type AvailabilityInfo,
  type ExperienceEntry,
  type ProfessionalSummary,
  type RecruiterCertification,
  type RecruiterContent,
  type RecruiterProject,
  type SkillEntry,
  SkillCategory,
} from "../types";

const CONTENT_ROOT = path.join(process.cwd(), "src", "features", "recruiter", "content");

function parseLinks(value: string | string[] | undefined): { label: string; url: string }[] {
  return asArray(value)
    .map((entry) => entry.split("|").map((part) => part.trim()))
    .filter((parts): parts is [string, string] => parts.length === 2)
    .map(([label, url]) => ({ label, url }));
}

function parseSkillLines(body: string, category: SkillCategory): SkillEntry[] {
  return [...body.matchAll(/^-\s+(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)$/gm)].map((match) => ({
    name: match[1].trim(),
    level: match[2].trim(),
    years: match[3].trim(),
    category,
  }));
}

async function loadSummary(): Promise<ProfessionalSummary> {
  const [file] = await readMarkdownDirectory(CONTENT_ROOT).then((files) =>
    files.filter((entry) => entry.id === "summary"),
  );

  return {
    name: asString(file?.data.name),
    title: asString(file?.data.title),
    yearsExperience: asString(file?.data.yearsExperience),
    primaryExpertise: asArray(file?.data.primaryExpertise),
    currentFocus: asString(file?.data.currentFocus),
    location: asString(file?.data.location),
    timezone: asString(file?.data.timezone),
    bio: file?.body ?? "",
  };
}

async function loadAvailability(): Promise<AvailabilityInfo> {
  const [file] = await readMarkdownDirectory(CONTENT_ROOT).then((files) =>
    files.filter((entry) => entry.id === "availability"),
  );

  return {
    openToWork: asBoolean(file?.data.openToWork),
    consulting: asBoolean(file?.data.consulting),
    contract: asBoolean(file?.data.contract),
    fullTime: asBoolean(file?.data.fullTime),
    timezone: asString(file?.data.timezone),
    preferredEngagement: asString(file?.data.preferredEngagement),
  };
}

async function loadExperience(): Promise<ExperienceEntry[]> {
  const files = await readMarkdownDirectory(path.join(CONTENT_ROOT, "experience"));

  return files
    .map(({ id, data, body }) => ({
      id,
      company: asString(data.company),
      role: asString(data.role),
      duration: asString(data.duration),
      summary: body,
      order: Number(asString(data.order)) || 0,
    }))
    .sort((a, b) => a.order - b.order);
}

async function loadSkills(): Promise<SkillEntry[]> {
  const files = await readMarkdownDirectory(path.join(CONTENT_ROOT, "skills"));

  return files.flatMap(({ data, body }) => {
    const category = asString(data.category) as SkillCategory;
    return parseSkillLines(body, category);
  });
}

async function loadCertifications(): Promise<RecruiterCertification[]> {
  const files = await readMarkdownDirectory(path.join(CONTENT_ROOT, "certifications"));

  return files.map(({ id, data }) => ({
    id,
    title: asString(data.title),
    issuer: asString(data.issuer),
    year: asString(data.year),
    summary: asString(data.summary),
  }));
}

async function loadProjects(): Promise<RecruiterProject[]> {
  const files = await readMarkdownDirectory(path.join(CONTENT_ROOT, "projects"));

  return files.map(({ id, data, body }) => ({
    id,
    title: asString(data.title),
    description: asString(data.description),
    technologies: asArray(data.technologies),
    businessImpact: asString(data.businessImpact),
    role: asString(data.role),
    links: parseLinks(data.links),
    detail: body,
  }));
}

/**
 * Reads all recruiter dashboard content from markdown, reusing the shared
 * directory reader (no hardcoded UI strings). Provider-independent — pure
 * filesystem + text work.
 */
export const RecruiterContentLoader = {
  async load(): Promise<RecruiterContent> {
    const [summary, availability, experience, skills, certifications, projects] =
      await Promise.all([
        loadSummary(),
        loadAvailability(),
        loadExperience(),
        loadSkills(),
        loadCertifications(),
        loadProjects(),
      ]);

    return { summary, availability, experience, skills, certifications, projects };
  },
};
