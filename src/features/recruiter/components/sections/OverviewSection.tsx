"use client";

import { RecruiterQuickActions } from "../RecruiterQuickActions";
import type { ProfessionalSummary } from "../../types";

import styles from "./sections.module.css";

export function OverviewSection({ summary }: { summary: ProfessionalSummary }) {
  return (
    <div>
      <h2 className={styles.heading}>Overview</h2>

      <p className={styles.overviewName}>
        {summary.name} — {summary.title}
      </p>

      <p className={styles.bio}>{summary.currentFocus}</p>

      <div className={styles.tags}>
        {summary.primaryExpertise.map((expertise) => (
          <span key={expertise} className={styles.tag}>
            {expertise}
          </span>
        ))}
      </div>

      <h3 className={styles.subheading}>Ask Kumail directly</h3>
      <RecruiterQuickActions />
    </div>
  );
}
