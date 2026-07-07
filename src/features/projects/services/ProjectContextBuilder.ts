import "server-only";

import type { Project } from "../types";

/**
 * Builds a plain-text briefing from a full Project record, used to ground the
 * assistant's answers while a visitor is viewing that project. Pure text
 * synthesis — no model or provider code.
 */
export const ProjectContextBuilder = {
  build(project: Project): string {
    const lines: string[] = [
      `${project.title} — ${project.role} at ${project.company} (${project.startDate} – ${project.endDate || "Present"}).`,
      project.description,
    ];

    if (project.architecture.length > 0) {
      lines.push(
        "Architecture:",
        project.architecture.map((section) => `- ${section.title}: ${section.content}`).join("\n"),
      );
    }

    if (project.challenges.length > 0) {
      lines.push(`Challenges: ${project.challenges.join("; ")}`);
    }

    if (project.solutions.length > 0) {
      lines.push(`Solutions: ${project.solutions.join("; ")}`);
    }

    if (project.businessImpact) {
      lines.push(`Business impact: ${project.businessImpact}`);
    }

    if (project.lessonsLearned.length > 0) {
      lines.push(`Lessons learned: ${project.lessonsLearned.join("; ")}`);
    }

    return lines.filter(Boolean).join("\n\n");
  },
};
