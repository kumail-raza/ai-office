"use client";

import { useMemo, useSyncExternalStore } from "react";

import { avatarManager } from "../services/AvatarManager";
import {
  type AvatarExpression,
  type AvatarGesture,
  type AvatarSnapshot,
  type AvatarState,
  type EyeTarget,
} from "../types";

export interface AvatarActions {
  setState: (state: AvatarState) => void;
  transition: (state: AvatarState) => void;
  setExpression: (expression: AvatarExpression) => void;
  blendExpression: (expression: AvatarExpression, weight: number) => void;
  playGesture: (gesture: AvatarGesture, durationMs?: number) => void;
  lookAt: (target: EyeTarget) => void;
  headLookAt: (target: EyeTarget) => void;
  returnHeadToNeutral: () => void;
}

export interface UseAvatarResult {
  currentState: AvatarState;
  currentExpression: AvatarExpression;
  currentTarget: EyeTarget;
  currentGesture: AvatarGesture;
  actions: AvatarActions;
}

const SERVER_SNAPSHOT: AvatarSnapshot = avatarManager.getSnapshot();

export function useAvatar(): UseAvatarResult {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => avatarManager.subscribe(onStoreChange),
    () => avatarManager.getSnapshot(),
    () => SERVER_SNAPSHOT,
  );

  const actions = useMemo<AvatarActions>(
    () => ({
      setState: (state) => avatarManager.setState(state),
      transition: (state) => avatarManager.transition(state),
      setExpression: (expression) => avatarManager.expression.setExpression(expression),
      blendExpression: (expression, weight) => avatarManager.expression.blendTo(expression, weight),
      playGesture: (gesture, durationMs) => avatarManager.gesture.play(gesture, durationMs),
      lookAt: (target) => avatarManager.eyes.lookAt(target),
      headLookAt: (target) => avatarManager.head.lookAt(target),
      returnHeadToNeutral: () => avatarManager.head.returnToNeutral(),
    }),
    [],
  );

  return {
    currentState: snapshot.state,
    currentExpression: snapshot.expression,
    currentTarget: snapshot.eyeTarget,
    currentGesture: snapshot.gesture,
    actions,
  };
}
