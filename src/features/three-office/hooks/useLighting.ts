"use client";

import { useSyncExternalStore } from "react";

import { lightingManager } from "../managers/LightingManager";
import type { LightingMode } from "../types";

/** Subscribe to the active lighting mode. */
export function useLightingMode(): LightingMode {
  return useSyncExternalStore(
    (onStoreChange) => lightingManager.subscribe(onStoreChange),
    () => lightingManager.getMode(),
    () => lightingManager.getMode(),
  );
}
