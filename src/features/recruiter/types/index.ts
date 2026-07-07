export interface ProfessionalSummary {
  name: string;
  title: string;
  yearsExperience: string;
  primaryExpertise: string[];
  currentFocus: string;
  location: string;
  timezone: string;
  bio: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  duration: string;
  summary: string;
  order: number;
}

export enum SkillCategory {
  Architecture = "Architecture",
  Cloud = "Cloud",
  DevOps = "DevOps",
  AI = "AI",
  Backend = "Backend",
  Frontend = "Frontend",
  Leadership = "Leadership",
  Consulting = "Consulting",
}

export interface SkillEntry {
  name: string;
  level: string;
  years: string;
  category: SkillCategory;
}

export interface RecruiterCertification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  summary: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface RecruiterProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  businessImpact: string;
  role: string;
  links: ProjectLink[];
  detail: string;
}

export interface AvailabilityInfo {
  openToWork: boolean;
  consulting: boolean;
  contract: boolean;
  fullTime: boolean;
  timezone: string;
  preferredEngagement: string;
}

export interface RecruiterContent {
  summary: ProfessionalSummary;
  experience: ExperienceEntry[];
  skills: SkillEntry[];
  certifications: RecruiterCertification[];
  projects: RecruiterProject[];
  availability: AvailabilityInfo;
}

export enum RecruiterSection {
  Overview = "overview",
  Summary = "summary",
  Experience = "experience",
  Skills = "skills",
  Certifications = "certifications",
  Projects = "projects",
  Availability = "availability",
  Contact = "contact",
}
