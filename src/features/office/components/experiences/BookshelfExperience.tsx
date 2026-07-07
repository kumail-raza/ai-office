"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { useOfficeContent } from "../../hooks/useOfficeContent";
import type { OfficeResourceCategory } from "../../types";

import styles from "./experiences.module.css";

export function BookshelfExperience() {
  const { content, loading, error } = useOfficeContent();
  const [selected, setSelected] = useState<OfficeResourceCategory | null>(null);

  if (error) return <p className={styles.status}>The library is unavailable right now.</p>;
  if (loading || content === null) return <p className={styles.status}>Loading…</p>;

  if (selected) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <button type="button" className={styles.back} onClick={() => setSelected(null)}>
          ← All categories
        </button>
        <h4 className={styles.cardTitle}>{selected.title}</h4>
        <ul className={styles.list}>
          {selected.resources.map((resource) => (
            <li key={resource.title} className={styles.card}>
              <p className={styles.cardTitle}>{resource.title}</p>
              <p className={styles.cardDesc}>{resource.description}</p>
            </li>
          ))}
        </ul>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.cardGrid}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
    >
      {content.resources.map((category) => (
        <button
          key={category.id}
          type="button"
          className={styles.card}
          onClick={() => setSelected(category)}
        >
          <p className={styles.cardTitle}>{category.title}</p>
          <p className={styles.cardDesc}>{category.resources.length} resources</p>
        </button>
      ))}
    </motion.div>
  );
}
