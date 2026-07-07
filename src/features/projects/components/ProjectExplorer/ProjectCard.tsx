"use client";

import type { Project } from "../../types";

import styles from "./ProjectExplorer.module.css";

const STATUS_LABEL: Record<Project["status"], string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  maintained: "Maintained",
  archived: "Archived",
};

export function ProjectCard({ project, onSelect }: { project: Project; onSelect: () => void }) {
  return (
    <button type="button" className={styles.card} onClick={onSelect}>
      <div className={styles.cardHeader}>
        <p className={styles.cardTitle}>{project.title}</p>
        <span className={styles.statusBadge}>{STATUS_LABEL[project.status]}</span>
      </div>
      <p className={styles.cardSummary}>{project.summary}</p>
      <div className={styles.tags}>
        {project.technologies.slice(0, 4).map((tech) => (
          <span key={tech} className={styles.tag}>
            {tech}
          </span>
        ))}
      </div>
    </button>
  );
}
