"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { useOfficeContent } from "../../hooks/useOfficeContent";
import type { OfficeProject } from "../../types";

import styles from "./experiences.module.css";

export function MonitorExperience() {
  const { content, loading, error } = useOfficeContent();
  const [selected, setSelected] = useState<OfficeProject | null>(null);

  if (error) return <p className={styles.status}>Projects are unavailable right now.</p>;
  if (loading || content === null) return <p className={styles.status}>Powering on…</p>;

  if (selected) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <button type="button" className={styles.back} onClick={() => setSelected(null)}>
          ← All projects
        </button>
        <h4 className={styles.cardTitle}>{selected.title}</h4>
        <div className={styles.tags}>
          {selected.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <p className={styles.detailText}>{selected.detail}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.cardGrid}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {content.projects.map((project) => (
        <button
          key={project.id}
          type="button"
          className={styles.card}
          onClick={() => setSelected(project)}
        >
          <p className={styles.cardTitle}>{project.title}</p>
          <p className={styles.cardDesc}>{project.description}</p>
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </button>
      ))}
    </motion.div>
  );
}
