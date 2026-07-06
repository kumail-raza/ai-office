"use client";

import { animate, useMotionValue, useReducedMotion, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { audioManager } from "@/engine/managers/AudioManager";

import { BOOT_MESSAGE, LOADER_CONFIG, LOADING_MESSAGES, type LoaderPhase } from "../constants";

interface LoaderSequence {
  phase: LoaderPhase;
  progress: MotionValue<number>;
  messageIndex: number;
  reducedMotion: boolean;
  /** Advances ready → completed once the exit fade has finished. */
  finishExit: () => void;
}

/**
 * Drives the loader state machine (idle → booting → loading → ready →
 * completed), a smooth 0→1 progress value, and the cycling boot messages.
 * Everything is timer/animation driven and fully cleaned up on unmount, so the
 * sequence is interrupt-safe.
 */
export function useLoaderSequence(): LoaderSequence {
  const reducedMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<LoaderPhase>("idle");
  const [messageIndex, setMessageIndex] = useState(0);
  const progress = useMotionValue(0);

  useEffect(() => {
    setPhase("booting");
    audioManager.playAmbient();

    const typingMs = (reducedMotion ? 0 : BOOT_MESSAGE.length * LOADER_CONFIG.TYPING_SPEED) * 1000;
    const toLoading = window.setTimeout(() => setPhase("loading"), typingMs);

    const controls = animate(progress, 1, {
      duration: LOADER_CONFIG.BOOT_DURATION,
      ease: "easeInOut",
      onComplete: () => setPhase("ready"),
    });

    return () => {
      window.clearTimeout(toLoading);
      controls.stop();
      audioManager.stopAmbient();
    };
  }, [progress, reducedMotion]);

  useEffect(() => {
    if (phase !== "loading") return;

    const interval = window.setInterval(() => {
      setMessageIndex((index) => Math.min(index + 1, LOADING_MESSAGES.length - 1));
    }, LOADER_CONFIG.MESSAGE_INTERVAL * 1000);

    return () => window.clearInterval(interval);
  }, [phase]);

  const finishExit = useCallback(() => {
    setPhase((current) => (current === "ready" ? "completed" : current));
  }, []);

  return { phase, progress, messageIndex, reducedMotion, finishExit };
}
