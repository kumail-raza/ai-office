"use client";

import type { Project } from "../../../types";

import styles from "./sections.module.css";

export function StackSection({ project }: { project: Project }) {
  return (
    <div>
      <h3 className={styles.heading}>Technology Stack</h3>
      <div className={styles.tags}>
        {project.technologies.map((tech) => (
          <span key={tech} className={styles.tag}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
