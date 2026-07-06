"use client";

import { motion } from "framer-motion";

import { LOADER_CONFIG } from "../../constants";

import styles from "./BootLogo.module.css";

interface BootLogoProps {
  reducedMotion: boolean;
}

export function BootLogo({ reducedMotion }: BootLogoProps) {
  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: LOADER_CONFIG.TRANSITION_DURATION, ease: "easeOut" }}
    >
      {/* Ambient radial glow — soft, breathing, never flashing. */}
      <motion.span
        aria-hidden="true"
        className={styles.glow}
        animate={reducedMotion ? undefined : { opacity: [0.5, 0.8, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Very faint slowly rotating outer ring. */}
      <motion.span
        aria-hidden="true"
        className={styles.ring}
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      />

      {/* Logo disc with a gentle pulse every few seconds. */}
      <motion.div
        className={styles.disc}
        animate={reducedMotion ? undefined : { scale: [1, 1.04, 1] }}
        transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}
      >
        <span className={styles.initial}>K</span>
      </motion.div>
    </motion.div>
  );
}
