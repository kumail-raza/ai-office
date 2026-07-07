"use client";

import type { Project } from "../../../types";

import styles from "./sections.module.css";

export function RoleSection({ project }: { project: Project }) {
  return (
    <div>
      <h3 className={styles.heading}>My Role</h3>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Role</span>
          <span className={styles.fieldValue}>{project.role}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Company</span>
          <span className={styles.fieldValue}>{project.company}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Duration</span>
          <span className={styles.fieldValue}>
            {project.startDate} – {project.endDate || "Present"}
          </span>
        </div>
      </div>
    </div>
  );
}
