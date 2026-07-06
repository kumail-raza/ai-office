"use client";

import { useEffect, useRef, useState } from "react";

import { CameraTransitionManager } from "@/engine/managers/CameraTransitionManager";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import { useAppStore } from "@/stores/app.store";
import { TRANSITION_TIMING, TransitionState } from "@/stores/transition.store";

import styles from "./TransitionScene.module.css";

const OVERLAY_OPACITY: Record<TransitionState, number> = {
  [TransitionState.IDLE]: 1,
  [TransitionState.FADING_OUT]: 1,
  [TransitionState.OUTSIDE_OFFICE]: 0,
  [TransitionState.CAMERA_MOVING]: 0,
  [TransitionState.ENTERING_ROOM]: 1,
  [TransitionState.COMPLETE]: 1,
};

export function TransitionScene() {
  const goToOffice = useAppStore((state) => state.goToOffice);

  const [phase, setPhase] = useState<TransitionState>(TransitionState.IDLE);

  const phaseRef = useRef<TransitionState>(TransitionState.IDLE);
  const phaseElapsedRef = useRef(0);
  const completedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const worldRef = useRef<HTMLDivElement>(null);

  const cameraRef = useRef<CameraTransitionManager | null>(null);
  if (cameraRef.current === null) {
    cameraRef.current = new CameraTransitionManager({ duration: TRANSITION_TIMING.cameraDuration });
  }

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useAnimationFrame(({ deltaTime }) => {
    const camera = cameraRef.current;
    if (!camera) return;

    const advance = (next: TransitionState): void => {
      phaseRef.current = next;
      phaseElapsedRef.current = 0;
      setPhase(next);
    };

    phaseElapsedRef.current += deltaTime;

    switch (phaseRef.current) {
      case TransitionState.IDLE:
        advance(TransitionState.FADING_OUT);
        break;

      case TransitionState.FADING_OUT:
        if (phaseElapsedRef.current >= TRANSITION_TIMING.fadeDuration) {
          advance(
            reducedMotionRef.current
              ? TransitionState.ENTERING_ROOM
              : TransitionState.OUTSIDE_OFFICE,
          );
        }
        break;

      case TransitionState.OUTSIDE_OFFICE:
        if (phaseElapsedRef.current >= TRANSITION_TIMING.exteriorHold) {
          camera.start();
          advance(TransitionState.CAMERA_MOVING);
        }
        break;

      case TransitionState.CAMERA_MOVING: {
        camera.update(deltaTime);
        const world = worldRef.current;
        if (world) {
          const { scale, offsetX, offsetY } = camera.getTransform();
          world.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;
        }
        if (camera.progress() >= 1) advance(TransitionState.ENTERING_ROOM);
        break;
      }

      case TransitionState.ENTERING_ROOM:
        if (phaseElapsedRef.current >= TRANSITION_TIMING.fadeDuration) {
          advance(TransitionState.COMPLETE);
        }
        break;

      case TransitionState.COMPLETE:
        if (!completedRef.current) {
          completedRef.current = true;
          // Hand off to the parent flow — this scene never mounts the workspace.
          goToOffice();
        }
        break;
    }
  });

  return (
    <div className={styles.root}>
      <div ref={worldRef} className={styles.world}>
        <div className={styles.exterior} aria-hidden="true">
          <div className={styles.building}>
            <div className={styles.windows} />
            <div className={styles.glass} />
            <div className={styles.door} />
          </div>
        </div>
      </div>

      <div
        className={styles.overlay}
        aria-hidden="true"
        style={{
          opacity: OVERLAY_OPACITY[phase],
          transitionDuration: `${TRANSITION_TIMING.fadeDuration}ms`,
        }}
      />

      <p className={styles.srOnly} role="status">
        Entering the workspace…
      </p>
    </div>
  );
}
