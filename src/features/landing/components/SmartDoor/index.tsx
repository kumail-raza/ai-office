"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { KeyboardEvent, RefObject } from "react";

import { DURATION, EASING } from "@/config/motion";
import type { DoorPhase } from "@/stores/app.store";

import { DOOR_CONFIG } from "../../config";

import styles from "./SmartDoor.module.css";

interface SmartDoorProps {
  doorRef: RefObject<HTMLDivElement | null>;
  phase: DoorPhase;
  visitorName: string;
  onOpenClick: () => void;
  onUnlockComplete: () => void;
  onOpenComplete: () => void;
}

function glowOpacity(phase: DoorPhase): number {
  switch (phase) {
    case "activating":
      return 0.35;
    case "unlocking":
      return 0.7;
    case "unlocked":
      return 0.6;
    case "opening":
      return 0.4;
    default:
      return 0;
  }
}

export function SmartDoor({
  doorRef,
  phase,
  visitorName,
  onOpenClick,
  onUnlockComplete,
  onOpenComplete,
}: SmartDoorProps) {
  const isBreathing =
    phase === "activating" || phase === "unlocking" || phase === "unlocked" || phase === "opening";
  const isUnlockedOrBeyond =
    phase === "unlocking" || phase === "unlocked" || phase === "opening" || phase === "opened";
  const isUnlocked = phase === "unlocked";
  const isOpening = phase === "opening" || phase === "opened";
  const showWelcome = phase !== "idle" && visitorName.trim().length > 0;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenClick();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div ref={doorRef} className={styles.frame} aria-label="Smart door">
        <motion.div
          aria-hidden="true"
          className={styles.glow}
          animate={{
            opacity: glowOpacity(phase),
            scale: isBreathing ? [1, 1.06, 1] : 1,
          }}
          transition={{
            opacity: { duration: DURATION.base, ease: EASING.standard },
            scale: isBreathing
              ? {
                  duration: DOOR_CONFIG.breathing.duration,
                  ease: DOOR_CONFIG.breathing.ease,
                  repeat: Infinity,
                }
              : { duration: DURATION.base },
          }}
        />

        <motion.div
          className={isUnlocked ? `${styles.panel} ${styles.interactive}` : styles.panel}
          role={isUnlocked ? "button" : undefined}
          tabIndex={isUnlocked ? 0 : undefined}
          aria-label={isUnlocked ? "Open door" : undefined}
          onClick={isUnlocked ? onOpenClick : undefined}
          onKeyDown={isUnlocked ? handleKeyDown : undefined}
          animate={{ rotateY: isOpening ? DOOR_CONFIG.open.hingeAngle : 0 }}
          transition={{ duration: DOOR_CONFIG.open.duration, ease: DOOR_CONFIG.open.ease }}
          whileHover={isUnlocked ? { scale: 1.02 } : undefined}
          onAnimationComplete={() => {
            if (phase === "opening") onOpenComplete();
          }}
        >
          <motion.span
            aria-hidden="true"
            className={styles.handleGlow}
            animate={{ opacity: isBreathing ? 0.85 : 0 }}
            transition={{ duration: DURATION.base, ease: EASING.standard }}
          />

          <motion.span
            aria-hidden="true"
            className={styles.handle}
            animate={{ rotate: isUnlockedOrBeyond ? DOOR_CONFIG.unlock.handleRotation : 0 }}
            transition={{ duration: DOOR_CONFIG.unlock.duration, ease: DOOR_CONFIG.unlock.ease }}
            onAnimationComplete={() => {
              if (phase === "unlocking") onUnlockComplete();
            }}
          />

          {phase === "idle" ? <span className={styles.label}>Door</span> : null}
        </motion.div>
      </div>

      <AnimatePresence>
        {showWelcome ? (
          <motion.p
            key="welcome"
            className={styles.welcome}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASING.entrance }}
          >
            Welcome, {visitorName.trim()}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
