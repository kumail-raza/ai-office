"use client";

import { MarkdownMessage } from "@/features/conversation";

import type { Project } from "../../../types";

import styles from "./sections.module.css";

export function OverviewSection({ project }: { project: Project }) {
  return (
    <div>
      <h3 className={styles.heading}>Overview</h3>
      <MarkdownMessage content={project.description || project.summary} />
    </div>
  );
}
