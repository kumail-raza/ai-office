"use client";

import type { AvailabilityInfo } from "../../types";

import styles from "./sections.module.css";

export function AvailabilitySection({ availability }: { availability: AvailabilityInfo }) {
  const badges: Array<[string, boolean]> = [
    ["Open to Work", availability.openToWork],
    ["Consulting", availability.consulting],
    ["Contract", availability.contract],
    ["Full-Time", availability.fullTime],
  ];

  return (
    <div>
      <h2 className={styles.heading}>Availability</h2>

      <div className={styles.availabilityGrid}>
        {badges.map(([label, on]) => (
          <span key={label} className={`${styles.badge} ${on ? styles.badgeOn : ""}`}>
            <span aria-hidden="true">{on ? "●" : "○"}</span>
            {label}
          </span>
        ))}
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Timezone</span>
          <span className={styles.fieldValue}>{availability.timezone}</span>
        </div>
      </div>

      <p className={styles.cardText}>{availability.preferredEngagement}</p>
    </div>
  );
}
