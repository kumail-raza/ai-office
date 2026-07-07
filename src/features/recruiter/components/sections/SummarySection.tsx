"use client";

import type { ProfessionalSummary } from "../../types";

import styles from "./sections.module.css";

export function SummarySection({ summary }: { summary: ProfessionalSummary }) {
  const fields: Array<[string, string]> = [
    ["Name", summary.name],
    ["Title", summary.title],
    ["Years of Experience", summary.yearsExperience],
    ["Current Focus", summary.currentFocus],
    ["Location", summary.location],
    ["Timezone", summary.timezone],
  ];

  return (
    <div>
      <h2 className={styles.heading}>Professional Summary</h2>

      <div className={styles.summaryRow}>
        {fields.map(([label, value]) => (
          <div key={label} className={styles.field}>
            <span className={styles.fieldLabel}>{label}</span>
            <span className={styles.fieldValue}>{value}</span>
          </div>
        ))}
      </div>

      <div className={styles.tags}>
        {summary.primaryExpertise.map((expertise) => (
          <span key={expertise} className={styles.tag}>
            {expertise}
          </span>
        ))}
      </div>

      <p className={styles.bio}>{summary.bio}</p>
    </div>
  );
}
