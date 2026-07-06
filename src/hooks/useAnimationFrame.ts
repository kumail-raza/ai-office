"use client";

import { useCallback, useEffect, useRef } from "react";

export interface FrameInfo {
  /** Milliseconds since the previous frame. */
  deltaTime: number;
  /** Milliseconds accumulated while running (excludes paused time). */
  elapsedTime: number;
}

export interface AnimationFrameControls {
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isRunning: () => boolean;
}

/**
 * Reusable requestAnimationFrame loop. Drives per-frame work (camera, particles,
 * avatar, door) without React re-renders — the callback is held in a ref so
 * consumers can read/write their own refs each frame. Fully cleaned up on
 * unmount.
 */
export function useAnimationFrame(
  callback: (frame: FrameInfo) => void,
  active = true,
): AnimationFrameControls {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const runningRef = useRef(active);
  const stoppedRef = useRef(false);

  useEffect(() => {
    const loop = (now: number): void => {
      if (stoppedRef.current) return;

      if (lastTimeRef.current === null) lastTimeRef.current = now;
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (runningRef.current) {
        elapsedRef.current += deltaTime;
        callbackRef.current({ deltaTime, elapsedTime: elapsedRef.current });
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      stoppedRef.current = true;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const pause = useCallback(() => {
    runningRef.current = false;
  }, []);

  const resume = useCallback(() => {
    runningRef.current = true;
    // Drop the accumulated gap so resuming does not produce a large deltaTime.
    lastTimeRef.current = null;
  }, []);

  const stop = useCallback(() => {
    runningRef.current = false;
    stoppedRef.current = true;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const isRunning = useCallback(() => runningRef.current && !stoppedRef.current, []);

  return { pause, resume, stop, isRunning };
}
