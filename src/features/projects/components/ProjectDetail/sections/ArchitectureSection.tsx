"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { MarkdownMessage } from "@/features/conversation";

import type { Project } from "../../../types";

import styles from "./sections.module.css";

export function ArchitectureSection({ project }: { project: Project }) {
  const [expandedId, setExpandedId] = useState<string | null>(project.architecture[0]?.id ?? null);

  if (project.architecture.length === 0) {
    return (
      <div>
        <h3 className={styles.heading}>Architecture</h3>
        <p className={styles.text}>No architecture notes recorded for this project yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className={styles.heading}>Architecture</h3>
      {project.architecture.map((section) => {
        const expanded = expandedId === section.id;
        return (
          <div key={section.id} className={styles.architectureItem}>
            <button
              type="button"
              className={styles.architectureTrigger}
              aria-expanded={expanded}
              onClick={() => setExpandedId(expanded ? null : section.id)}
            >
              {section.title}
              <span className={styles.chevron} aria-hidden="true">
                {expanded ? "▲" : "▼"}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  className={styles.architectureBody}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <MarkdownMessage content={section.content} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
