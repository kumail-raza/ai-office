export enum ProjectStatus {
  Completed = "completed",
  InProgress = "in-progress",
  Maintained = "maintained",
  Archived = "archived",
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectArchitectureSection {
  id: string;
  title: string;
  content: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  technologies: string[];
  architecture: ProjectArchitectureSection[];
  challenges: string[];
  solutions: string[];
  businessImpact: string;
  lessonsLearned: string[];
  images: ProjectImage[];
  links: ProjectLink[];
}

export type ProjectSortKey = "recent" | "oldest" | "title";

export interface ProjectFilterState {
  query: string;
  technologies: string[];
  statuses: ProjectStatus[];
  sort: ProjectSortKey;
}

export enum ProjectDetailSection {
  Overview = "overview",
  Role = "role",
  Architecture = "architecture",
  Challenges = "challenges",
  Solutions = "solutions",
  Impact = "impact",
  Lessons = "lessons",
  Stack = "stack",
  Resources = "resources",
}
