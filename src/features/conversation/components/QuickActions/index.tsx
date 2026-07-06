"use client";

import { motion, type Variants } from "framer-motion";

import { PromptService } from "../../services/PromptService";

import styles from "./QuickActions.module.css";

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
  disabled: boolean;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  return (
    <motion.div className={styles.grid} variants={container} initial="hidden" animate="visible">
      {PromptService.quickActions.map((action) => (
        <motion.button
          key={action.id}
          type="button"
          className={styles.card}
          variants={item}
          whileHover={disabled ? undefined : { scale: 1.02 }}
          whileTap={disabled ? undefined : { scale: 0.98 }}
          disabled={disabled}
          onClick={() => onSelect(action.prompt)}
        >
          {action.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
