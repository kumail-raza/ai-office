"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useOfficeInteraction } from "../../hooks/useOfficeInteraction";
import type { OfficeObject } from "../../types";

import styles from "./InteractiveObject.module.css";

export function InteractiveObject({ object }: { object: OfficeObject }) {
  const { hoveredId, setHovered, selectObject } = useOfficeInteraction();
  const active = hoveredId === object.id;

  return (
    <motion.button
      type="button"
      className={styles.hotspot}
      style={{ left: `${object.position.x}%`, top: `${object.position.y}%` }}
      aria-label={object.name}
      onMouseEnter={() => setHovered(object.id)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(object.id)}
      onBlur={() => setHovered(null)}
      onClick={() => selectObject(object)}
      animate={{ scale: active ? 1.12 : 1 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <AnimatePresence>
        {active ? (
          <motion.span
            key="label"
            className={styles.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <span aria-hidden="true">{object.icon}</span>
            {object.name}
          </motion.span>
        ) : null}
      </AnimatePresence>
      <span className={`${styles.dot} ${active ? styles.dotActive : ""}`} aria-hidden="true" />
    </motion.button>
  );
}
