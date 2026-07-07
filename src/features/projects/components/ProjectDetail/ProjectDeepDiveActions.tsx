"use client";

import { useConversation } from "@/features/conversation";

import { DEEP_DIVE_ACTIONS } from "../../constants/deepDiveActions";
import { projectAnalytics } from "../../services/ProjectAnalytics";
import type { Project } from "../../types";

import styles from "./ProjectDetail.module.css";

/**
 * Sends contextual prompts into the SAME conversation engine used elsewhere
 * (via useConversation) rather than a separate chat surface. The conversation
 * panel stays visible alongside the project detail view, so replies stream in
 * immediately without leaving the project.
 */
export function ProjectDeepDiveActions({ project }: { project: Project }) {
  const { sendMessage, isBusy } = useConversation();

  const handleClick = (actionId: string, buildPrompt: (target: Project) => string) => {
    sendMessage(buildPrompt(project));
    projectAnalytics.trackDeepDiveAction(project.slug, actionId);
  };

  return (
    <div className={styles.deepDive} role="group" aria-label="Deep dive actions">
      {DEEP_DIVE_ACTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          className={styles.deepDiveButton}
          disabled={isBusy}
          onClick={() => handleClick(action.id, action.buildPrompt)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
