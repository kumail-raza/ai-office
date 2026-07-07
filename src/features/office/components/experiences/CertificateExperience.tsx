"use client";

import { motion } from "framer-motion";

import { useOfficeContent } from "../../hooks/useOfficeContent";

import styles from "./experiences.module.css";

export function CertificateExperience() {
  const { content, loading, error } = useOfficeContent();

  if (error) return <p className={styles.status}>Certifications are unavailable right now.</p>;
  if (loading || content === null) return <p className={styles.status}>Loading…</p>;

  return (
    <motion.div
      className={styles.cardGrid}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {content.certifications.map((certification) => (
        <div key={certification.id} className={styles.card}>
          <p className={styles.cardTitle}>{certification.title}</p>
          <p className={styles.meta}>
            {certification.issuer} · {certification.year}
          </p>
          <p className={styles.cardDesc}>{certification.summary}</p>
        </div>
      ))}
    </motion.div>
  );
}
