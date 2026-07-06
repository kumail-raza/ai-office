"use client";

import { AnimatePresence, motion } from "framer-motion";

import { DURATION, EASING } from "@/config/motion";
import { useAppStore } from "@/stores/app.store";

import { LandingScene } from "../LandingScene";
import { LoaderScene } from "../LoaderScene";
import { OfficeScene } from "../OfficeScene";
import { TransitionScene } from "../TransitionScene";

import styles from "./styles/SceneManager.module.css";

const SCENES = {
  landing: LandingScene,
  loader: LoaderScene,
  transition: TransitionScene,
  office: OfficeScene,
} as const;

export function SceneManager() {
  const scene = useAppStore((s) => s.scene);
  const ActiveScene = SCENES[scene];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene}
        className={styles.scene}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: DURATION.sceneFade, ease: EASING.standard }}
      >
        <ActiveScene />
      </motion.div>
    </AnimatePresence>
  );
}
