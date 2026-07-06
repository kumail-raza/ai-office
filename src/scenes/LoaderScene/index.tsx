"use client";

import { motion } from "framer-motion";

import { useAppStore } from "@/stores/app.store";

import {
  BootLogo,
  BootMessages,
  ParticleLayer,
  ProgressBar,
  WelcomeMessage,
} from "./components";
import { LOADER_CONFIG } from "./constants";
import { useLoaderSequence } from "./hooks";

import styles from "./styles/LoaderScene.module.css";

export function LoaderScene() {
  const visitorName = useAppStore((s) => s.visitorName).trim();
  const goToTransition = useAppStore((s) => s.goToTransition);

  const { phase, progress, messageIndex, reducedMotion, finishExit } = useLoaderSequence();

  const isExiting = phase === "ready" || phase === "completed";

  const handleExitComplete = () => {
    if (phase !== "ready") return;
    finishExit();
    // Hand control back to the parent — the loader does not mount the workspace
    // itself; it only signals completion, which advances into the transition.
    goToTransition();
  };

  return (
    <motion.div
      className={styles.root}
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: LOADER_CONFIG.TRANSITION_DURATION, ease: "easeInOut" }}
      onAnimationComplete={handleExitComplete}
    >
      {/* Background: slow drifting gradient, particles, vignette. */}
      <motion.div
        aria-hidden="true"
        className={styles.gradient}
        animate={reducedMotion ? undefined : { x: ["-4%", "4%", "-4%"], y: ["3%", "-3%", "3%"] }}
        transition={{ duration: 26, ease: "easeInOut", repeat: Infinity }}
      />
      <ParticleLayer reducedMotion={reducedMotion} />
      <div aria-hidden="true" className={styles.vignette} />

      <div className={styles.content}>
        <div className={styles.stack}>
          <BootLogo reducedMotion={reducedMotion} />
          <BootMessages phase={phase} messageIndex={messageIndex} reducedMotion={reducedMotion} />
          <ProgressBar progress={progress} />
        </div>

        <WelcomeMessage name={visitorName} />
      </div>
    </motion.div>
  );
}
