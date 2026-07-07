"use client";

import type { Project } from "../../../types";

import styles from "./sections.module.css";

export function ImpactSection({ project }: { project: Project }) {
  return (
    <div>
      <h3 className={styles.heading}>Business Impact</h3>
      <p className={styles.text}>{project.businessImpact}</p>
    </div>
  );
}
