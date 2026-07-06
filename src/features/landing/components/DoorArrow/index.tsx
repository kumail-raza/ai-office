"use client";

import { motion } from "framer-motion";

import { DOOR_CONFIG } from "../../config";
import type { ArrowPath } from "../../hooks";

import styles from "./DoorArrow.module.css";

interface DoorArrowProps {
  path: ArrowPath;
  onArrive: () => void;
}

export function DoorArrow({ path, onArrive }: DoorArrowProps) {
  const { start, end } = path;

  return (
    <motion.div
      aria-hidden="true"
      className={styles.arrow}
      initial={{ x: start.x, y: start.y, opacity: 0, scale: 0.5 }}
      animate={{
        x: end.x,
        y: end.y,
        opacity: [0, 1, 1, 0.85],
        scale: [0.5, 1, 1, 0.85],
      }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{
        duration: DOOR_CONFIG.arrowTravel.duration,
        ease: DOOR_CONFIG.arrowTravel.ease,
      }}
      onAnimationComplete={onArrive}
    >
      <span className={styles.glyph}>➜</span>
    </motion.div>
  );
}
