"use client";

import type { Project } from "../../../types";

import styles from "./sections.module.css";

export function LessonsSection({ project }: { project: Project }) {
  return (
    <div>
      <h3 className={styles.heading}>Lessons Learned</h3>
      <ul className={styles.list}>
        {project.lessonsLearned.map((lesson) => (
          <li key={lesson} className={styles.listItem}>
            {lesson}
          </li>
        ))}
      </ul>
    </div>
  );
}
