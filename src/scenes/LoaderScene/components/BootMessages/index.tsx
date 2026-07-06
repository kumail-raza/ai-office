"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { BOOT_MESSAGE, LOADER_CONFIG, LOADING_MESSAGES, type LoaderPhase } from "../../constants";

import styles from "./BootMessages.module.css";

interface BootMessagesProps {
  phase: LoaderPhase;
  messageIndex: number;
  reducedMotion: boolean;
}

function useTypedText(active: boolean, reducedMotion: boolean): string {
  const [count, setCount] = useState(reducedMotion ? BOOT_MESSAGE.length : 0);

  useEffect(() => {
    if (!active) return;
    if (reducedMotion) {
      setCount(BOOT_MESSAGE.length);
      return;
    }

    let current = 0;
    const interval = window.setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= BOOT_MESSAGE.length) window.clearInterval(interval);
    }, LOADER_CONFIG.TYPING_SPEED * 1000);

    return () => window.clearInterval(interval);
  }, [active, reducedMotion]);

  return BOOT_MESSAGE.slice(0, count);
}

export function BootMessages({ phase, messageIndex, reducedMotion }: BootMessagesProps) {
  const isBooting = phase === "booting";
  const typed = useTypedText(isBooting, reducedMotion);

  return (
    <div className={styles.messages} role="status" aria-live="polite">
      {isBooting ? (
        <p className={styles.line}>
          {typed}
          <motion.span
            aria-hidden="true"
            className={styles.caret}
            animate={reducedMotion ? undefined : { opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
          >
            |
          </motion.span>
        </p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            className={styles.line}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {LOADING_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  );
}
