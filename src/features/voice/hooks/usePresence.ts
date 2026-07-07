"use client";

import { useSyncExternalStore } from "react";

import { presenceManager } from "../services/PresenceManager";
import { PresenceState } from "../types";

export function usePresence(): PresenceState {
  return useSyncExternalStore(
    (onStoreChange) => presenceManager.subscribe(onStoreChange),
    () => presenceManager.getState(),
    () => PresenceState.Idle,
  );
}
