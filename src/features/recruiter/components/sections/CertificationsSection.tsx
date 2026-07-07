"use client";

import { useMemo, useState } from "react";

import type { RecruiterCertification } from "../../types";

import styles from "./sections.module.css";

export function CertificationsSection({
  certifications,
}: {
  certifications: RecruiterCertification[];
}) {
  const issuers = useMemo(
    () => Array.from(new Set(certifications.map((cert) => cert.issuer))).sort(),
    [certifications],
  );
  const [activeIssuer, setActiveIssuer] = useState<string | null>(null);

  const visible = activeIssuer
    ? certifications.filter((cert) => cert.issuer === activeIssuer)
    : certifications;

  return (
    <div>
      <h2 className={styles.heading}>Certifications</h2>

      {issuers.length > 1 ? (
        <div className={styles.filterRow} role="group" aria-label="Filter by issuer">
          <button
            type="button"
            className={`${styles.filterChip} ${activeIssuer === null ? styles.filterChipActive : ""}`}
            onClick={() => setActiveIssuer(null)}
          >
            All
          </button>
          {issuers.map((issuer) => (
            <button
              key={issuer}
              type="button"
              className={`${styles.filterChip} ${activeIssuer === issuer ? styles.filterChipActive : ""}`}
              onClick={() => setActiveIssuer(issuer)}
            >
              {issuer}
            </button>
          ))}
        </div>
      ) : null}

      <div className={styles.grid}>
        {visible.map((cert) => (
          <div key={cert.id} className={styles.card}>
            <p className={styles.cardTitle}>{cert.title}</p>
            <p className={styles.cardMeta}>
              {cert.issuer} · {cert.year}
            </p>
            <p className={styles.cardText}>{cert.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
