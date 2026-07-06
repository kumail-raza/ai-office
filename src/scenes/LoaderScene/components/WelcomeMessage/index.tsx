"use client";

import { motion } from "framer-motion";

import { LOADER_CONFIG } from "../../constants";

import styles from "./WelcomeMessage.module.css";

interface WelcomeMessageProps {
  name: string;
}

export function WelcomeMessage({ name }: WelcomeMessageProps) {
  return (
    <motion.div
      className={styles.welcome}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: LOADER_CONFIG.WELCOME_DELAY,
        duration: LOADER_CONFIG.TRANSITION_DURATION,
        ease: "easeOut",
      }}
    >
      <p className={styles.greeting}>{name ? `Welcome, ${name}` : "Welcome"}</p>
      <p className={styles.sub}>Nice to meet you.</p>
    </motion.div>
  );
}
