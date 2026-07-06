"use client";

import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";

import styles from "./CameraRig.module.css";

interface CameraRigProps {
  children: ReactNode;
  reducedMotion: boolean;
}

/**
 * Framing wrapper for the workspace world. Today it applies a 2D establishing
 * push-in; the same seam can later host a Three.js / R3F / Spline camera without
 * changing the scene composition.
 */
export function CameraRig({ children, reducedMotion }: CameraRigProps) {
  const rigRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rig = rigRef.current;
    if (!rig || reducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        rig,
        { scale: 1.08 },
        { scale: 1, duration: 6, ease: "power1.out" },
      );
    }, rig);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div ref={rigRef} className={styles.rig}>
      {children}
    </div>
  );
}
