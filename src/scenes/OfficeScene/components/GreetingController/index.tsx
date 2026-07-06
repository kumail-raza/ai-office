"use client";

import { motion } from "framer-motion";
import gsap from "gsap";
import { useEffect, useMemo, useState } from "react";

import { WORKSPACE_TIMING, buildGreeting } from "../../workspace.constants";

import styles from "./GreetingController.module.css";

interface GreetingControllerProps {
  name: string;
  active: boolean;
  reducedMotion: boolean;
  onComplete: () => void;
}

export function GreetingController({
  name,
  active,
  reducedMotion,
  onComplete,
}: GreetingControllerProps) {
  const lines = useMemo(() => buildGreeting(name), [name]);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (reducedMotion) {
      setVisibleCount(lines.length);
      const call = gsap.delayedCall(0.4, onComplete);
      return () => call.kill();
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline();
      lines.forEach((_, index) => {
        timeline.call(
          () => setVisibleCount(index + 1),
          undefined,
          index === 0 ? 0 : `+=${WORKSPACE_TIMING.greetingLineStagger}`,
        );
      });
      timeline.call(onComplete, undefined, `+=${WORKSPACE_TIMING.greetingLineStagger}`);
    });

    return () => context.revert();
  }, [active, reducedMotion, lines, onComplete]);

  if (!active) return null;

  return (
    <div className={styles.speech} role="status" aria-live="polite">
      {lines.slice(0, visibleCount).map((line, index) => (
        <motion.p
          key={index}
          className={styles.line}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}
