"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

import { LOADER_CONFIG } from "../../constants";

import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  progress: MotionValue<number>;
}

interface SegmentProps {
  progress: MotionValue<number>;
  index: number;
  count: number;
}

function Segment({ progress, index, count }: SegmentProps) {
  // Each segment fills continuously as progress crosses its slice — smooth
  // interpolation, no stepped jumps.
  const fill = useTransform(progress, (value) => {
    const local = value * count - index;
    return Math.min(Math.max(local, 0), 1);
  });
  const opacity = useTransform(fill, (value) => 0.16 + value * 0.84);
  const boxShadow = useTransform(
    fill,
    (value) => `0 0 ${value * 12}px rgba(129, 140, 248, ${value * 0.75})`,
  );

  return <motion.span className={styles.segment} style={{ opacity, boxShadow }} />;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const segments = Array.from({ length: LOADER_CONFIG.PROGRESS_SEGMENTS }, (_, index) => index);

  return (
    <div
      className={styles.bar}
      role="progressbar"
      aria-label="Loading progress"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {segments.map((index) => (
        <Segment
          key={index}
          progress={progress}
          index={index}
          count={LOADER_CONFIG.PROGRESS_SEGMENTS}
        />
      ))}
    </div>
  );
}
