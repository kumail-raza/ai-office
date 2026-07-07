"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

import styles from "./ExperienceShell.module.css";

interface ExperienceShellProps {
  title: string;
  icon: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Reusable modal chrome for every office experience: backdrop, titled dialog,
 * close button, focus-on-open, and Escape-to-close. Content is provided per
 * experience.
 */
export function ExperienceShell({ title, icon, onClose, children }: ExperienceShellProps) {
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    shellRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <>
      <motion.div
        className={styles.backdrop}
        aria-hidden="true"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        ref={shellRef}
        className={styles.shell}
        role="dialog"
        aria-modal="true"
        aria-labelledby="office-experience-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.98 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <header className={styles.header}>
          <span className={styles.headerIcon} aria-hidden="true">
            {icon}
          </span>
          <h3 id="office-experience-title" className={styles.title}>
            {title}
          </h3>
          <button type="button" className={styles.close} aria-label="Close experience" onClick={onClose}>
            ✕
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </motion.div>
    </>
  );
}
