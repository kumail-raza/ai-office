"use client";

import { motion, useReducedMotion } from "framer-motion";

import { usePresence } from "../../hooks/usePresence";
import { PresenceState } from "../../types";

import styles from "./VoiceIndicator.module.css";

type IndicatorState = "idle" | "listening" | "thinking" | "speaking";

const LABELS: Record<IndicatorState, string> = {
  idle: "Idle",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
};

/** Folds the six presence states into the indicator's four visual states. */
function toIndicatorState(presence: PresenceState): IndicatorState {
  switch (presence) {
    case PresenceState.Listening:
      return "listening";
    case PresenceState.Thinking:
    case PresenceState.Processing:
      return "thinking";
    case PresenceState.Speaking:
      return "speaking";
    default:
      return "idle";
  }
}

const BAR_DELAYS = [0, 0.15, 0.3];

export function VoiceIndicator() {
  const presence = usePresence();
  const reducedMotion = useReducedMotion() ?? false;
  const state = toIndicatorState(presence);
  const pulsing = !reducedMotion && (state === "thinking" || state === "listening");

  return (
    <div
      className={`${styles.indicator} ${styles[state]}`}
      role="status"
      aria-live="polite"
      aria-label={`Assistant status: ${LABELS[state]}`}
    >
      {state === "speaking" && !reducedMotion ? (
        <span className={styles.bars} aria-hidden="true">
          {BAR_DELAYS.map((delay) => (
            <motion.span
              key={delay}
              className={styles.bar}
              animate={{ scaleY: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay }}
            />
          ))}
        </span>
      ) : (
        <motion.span
          className={styles.dot}
          aria-hidden="true"
          animate={pulsing ? { opacity: [0.4, 1, 0.4], scale: [0.85, 1, 0.85] } : { opacity: 1, scale: 1 }}
          transition={
            pulsing
              ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        />
      )}
      <span className={styles.label}>{LABELS[state]}</span>
    </div>
  );
}
