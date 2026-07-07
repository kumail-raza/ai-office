import type { Project } from "../types";

export interface DeepDiveAction {
  id: string;
  label: string;
  buildPrompt: (project: Project) => string;
}

export const DEEP_DIVE_ACTIONS: DeepDiveAction[] = [
  {
    id: "architecture",
    label: "Explain Architecture",
    buildPrompt: (project) => `Explain the architecture of ${project.title}.`,
  },
  {
    id: "challenges",
    label: "Show Challenges",
    buildPrompt: (project) => `What were the biggest challenges on ${project.title}?`,
  },
  {
    id: "impact",
    label: "Business Impact",
    buildPrompt: (project) => `What business impact did ${project.title} have?`,
  },
  {
    id: "decisions",
    label: "Technical Decisions",
    buildPrompt: (project) => `What were the key technical decisions behind ${project.title}?`,
  },
  {
    id: "lessons",
    label: "Lessons Learned",
    buildPrompt: (project) => `What did you learn from working on ${project.title}?`,
  },
  {
    id: "discussion",
    label: "Open Discussion",
    buildPrompt: (project) => `I'd like to discuss ${project.title} in more detail.`,
  },
];
