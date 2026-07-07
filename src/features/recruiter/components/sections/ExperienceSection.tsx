"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type { ExperienceEntry } from "../../types";

import styles from "./sections.module.css";

export function ExperienceSection({ experience }: { experience: ExperienceEntry[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id ?? null);

  return (
    <div>
      <h2 className={styles.heading}>Experience Timeline</h2>
      <div className={styles.timeline}>
        {experience.map((entry) => {
          const expanded = expandedId === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              className={styles.timelineItem}
              aria-expanded={expanded}
              onClick={() => setExpandedId(expanded ? null : entry.id)}
            >
              <div className={styles.timelineHeader}>
                <p className={styles.timelineRole}>{entry.role}</p>
                <span className={styles.timelineDuration}>{entry.duration}</span>
              </div>
              <p className={styles.timelineCompany}>{entry.company}</p>
              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.p
                    className={styles.timelineSummary}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {entry.summary}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
}
