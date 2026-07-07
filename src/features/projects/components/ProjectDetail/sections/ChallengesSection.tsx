"use client";

import type { Project } from "../../../types";

import styles from "./sections.module.css";

export function ChallengesSection({ project }: { project: Project }) {
  return (
    <div>
      <h3 className={styles.heading}>Challenges</h3>
      <ul className={styles.list}>
        {project.challenges.map((challenge) => (
          <li key={challenge} className={styles.listItem}>
            {challenge}
          </li>
        ))}
      </ul>
    </div>
  );
}
