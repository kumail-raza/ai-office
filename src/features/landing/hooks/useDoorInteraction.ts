"use client";

import { useCallback, useRef, useState } from "react";

import { audioManager } from "@/engine/managers/AudioManager";
import { useAppStore } from "@/stores/app.store";

export interface Point {
  x: number;
  y: number;
}

export interface ArrowPath {
  start: Point;
  end: Point;
}

/**
 * Owns the cross-component Smart Door choreography: measures the Continue
 * button and door positions, drives the glowing arrow, fires audio cues, and
 * advances the store's door phase. Intended to be used once, by the scene.
 */
export function useDoorInteraction() {
  const doorPhase = useAppStore((s) => s.doorPhase);
  const visitorName = useAppStore((s) => s.visitorName);
  const startActivation = useAppStore((s) => s.startActivation);
  const beginUnlock = useAppStore((s) => s.beginUnlock);
  const markUnlocked = useAppStore((s) => s.markUnlocked);
  const openDoor = useAppStore((s) => s.openDoor);
  const finishOpening = useAppStore((s) => s.finishOpening);
  const goToLoader = useAppStore((s) => s.goToLoader);

  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const doorRef = useRef<HTMLDivElement>(null);
  const [arrowPath, setArrowPath] = useState<ArrowPath | null>(null);

  const handleContinue = useCallback(() => {
    const button = continueButtonRef.current?.getBoundingClientRect();
    const door = doorRef.current?.getBoundingClientRect();

    if (button && door) {
      setArrowPath({
        start: { x: button.left + button.width / 2, y: button.top + button.height / 2 },
        end: { x: door.left + door.width / 2, y: door.top + door.height * 0.55 },
      });
      startActivation();
    } else {
      // No measurable geometry (edge case) — skip the arrow, go straight to unlock.
      startActivation();
      beginUnlock();
    }
  }, [startActivation, beginUnlock]);

  const handleArrowArrive = useCallback(() => {
    audioManager.doorUnlock();
    beginUnlock();
  }, [beginUnlock]);

  const handleUnlockComplete = useCallback(() => {
    markUnlocked();
  }, [markUnlocked]);

  const handleDoorClick = useCallback(() => {
    if (useAppStore.getState().doorPhase !== "unlocked") return;
    audioManager.doorOpen();
    openDoor();
  }, [openDoor]);

  const handleDoorOpenComplete = useCallback(() => {
    finishOpening();
    goToLoader();
  }, [finishOpening, goToLoader]);

  return {
    doorPhase,
    visitorName,
    continueButtonRef,
    doorRef,
    arrowPath,
    handleContinue,
    handleArrowArrive,
    handleUnlockComplete,
    handleDoorClick,
    handleDoorOpenComplete,
  };
}
