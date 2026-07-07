"use client";

import { motion } from "framer-motion";

import styles from "./ProjectExplorerToggle.module.css";

interface ProjectExplorerToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

/** Persistent entry point into the Project Experience, visible over the office and conversation alike. */
export function ProjectExplorerToggle({ isOpen, onToggle }: ProjectExplorerToggleProps) {
  return (
    <motion.button
      type="button"
      className={`${styles.toggle} ${isOpen ? styles.active : ""}`}
      aria-pressed={isOpen}
      onClick={onToggle}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      <span aria-hidden="true">🗂️</span>
      {isOpen ? "Close Projects" : "Explore Projects"}
    </motion.button>
  );
}
