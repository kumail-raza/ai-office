"use client";

import { motion } from "framer-motion";

import { useRecruiterStore } from "@/stores/recruiter.store";

import { recruiterAnalytics } from "../../services/RecruiterAnalytics";

import styles from "./RecruiterModeToggle.module.css";

/**
 * Persistent Recruiter Mode entry point. Rendered once at the workspace level so
 * it stays visible above the office, the object layer, and the conversation
 * panel alike — a single control rather than duplicated buttons per area.
 */
export function RecruiterModeToggle() {
  const isRecruiterMode = useRecruiterStore((state) => state.isRecruiterMode);
  const toggleRecruiterMode = useRecruiterStore((state) => state.toggleRecruiterMode);

  const handleClick = () => {
    if (!isRecruiterMode) recruiterAnalytics.trackModeEntered();
    toggleRecruiterMode();
  };

  return (
    <motion.button
      type="button"
      className={`${styles.toggle} ${isRecruiterMode ? styles.active : ""}`}
      aria-pressed={isRecruiterMode}
      onClick={handleClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      <span aria-hidden="true">💼</span>
      {isRecruiterMode ? "Exit Recruiter Mode" : "Recruiter Mode"}
    </motion.button>
  );
}
