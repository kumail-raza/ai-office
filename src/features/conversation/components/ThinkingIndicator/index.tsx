"use client";

import { motion } from "framer-motion";

import styles from "./ThinkingIndicator.module.css";

const DOTS = [0, 1, 2];

export function ThinkingIndicator() {
  return (
    <div className={styles.dots} role="status" aria-label="Assistant is thinking">
      {DOTS.map((index) => (
        <motion.span
          key={index}
          className={styles.dot}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, delay: index * 0.18 }}
        />
      ))}
    </div>
  );
}
