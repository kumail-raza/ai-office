"use client";

import type { Project } from "../../../types";

import styles from "./sections.module.css";

export function SolutionsSection({ project }: { project: Project }) {
  return (
    <div>
      <h3 className={styles.heading}>Solutions</h3>
      <ul className={styles.list}>
        {project.solutions.map((solution) => (
          <li key={solution} className={styles.listItem}>
            {solution}
          </li>
        ))}
      </ul>
    </div>
  );
}
