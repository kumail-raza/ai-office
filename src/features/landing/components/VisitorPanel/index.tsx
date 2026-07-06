"use client";

import { motion } from "framer-motion";
import type { RefObject } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel/GlassPanel";
import { DURATION, EASING } from "@/config/motion";
import { useAppStore } from "@/stores/app.store";

import { isVisitorNameValid } from "../../constants";

import styles from "./VisitorPanel.module.css";

interface VisitorPanelProps {
  continueButtonRef: RefObject<HTMLButtonElement | null>;
  onContinue: () => void;
}

export function VisitorPanel({ continueButtonRef, onContinue }: VisitorPanelProps) {
  const visitorName = useAppStore((s) => s.visitorName);
  const setVisitorName = useAppStore((s) => s.setVisitorName);

  const isValid = isVisitorNameValid(visitorName);

  const handleSubmit = () => {
    if (isValid) onContinue();
  };

  return (
    <GlassPanel as="section" aria-label="Visitor panel" className={styles.root}>
      <h2 className={styles.heading}>Before we begin...</h2>

      <input
        type="text"
        value={visitorName}
        onChange={(event) => setVisitorName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") handleSubmit();
        }}
        placeholder="Enter your name..."
        aria-label="Your name"
        className={styles.input}
        autoComplete="off"
      />

      <motion.button
        ref={continueButtonRef}
        type="button"
        disabled={!isValid}
        onClick={handleSubmit}
        className={styles.continue}
        whileHover={isValid ? { scale: 1.03 } : undefined}
        whileTap={isValid ? { scale: 0.97 } : undefined}
        transition={{ duration: DURATION.fast, ease: EASING.standard }}
      >
        Continue
      </motion.button>
    </GlassPanel>
  );
}
