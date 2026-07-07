"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { useOfficeInteraction } from "../../hooks/useOfficeInteraction";

import styles from "./OfficeObjectPanel.module.css";

/**
 * Reusable floating detail panel for any selected office object. Renders a
 * title, description, an action button, and a close button, with accessible
 * dialog semantics (focus on open, Escape to close).
 */
export function OfficeObjectPanel() {
  const { selectedObject, closePanel, runAction } = useOfficeInteraction();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedObject === null) return;

    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedObject, closePanel]);

  return (
    <AnimatePresence>
      {selectedObject ? (
        <>
          <motion.div
            className={styles.backdrop}
            aria-hidden="true"
            onClick={closePanel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="office-panel-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <button
              type="button"
              className={styles.close}
              aria-label="Close panel"
              onClick={closePanel}
            >
              ✕
            </button>
            <span className={styles.icon} aria-hidden="true">
              {selectedObject.icon}
            </span>
            <h3 id="office-panel-title" className={styles.title}>
              {selectedObject.name}
            </h3>
            <p className={styles.description}>{selectedObject.description}</p>
            <button
              type="button"
              className={styles.action}
              onClick={() => runAction(selectedObject)}
            >
              {selectedObject.action.label}
            </button>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
