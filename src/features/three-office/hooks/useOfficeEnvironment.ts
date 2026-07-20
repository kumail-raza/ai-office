"use client";

import { useSyncExternalStore } from "react";

import { officeEnvironmentManager } from "../managers/OfficeEnvironmentManager";
import type { AtmosphereConfig } from "../types";

/**
 * Subscribe to the environment's atmosphere. Re-renders only when the
 * composition/atmosphere actually changes — per-frame work stays imperative.
 */
export function useAtmosphere(): AtmosphereConfig {
  return useSyncExternalStore(
    (onStoreChange) => officeEnvironmentManager.subscribe(onStoreChange),
    () => officeEnvironmentManager.getAtmosphere(),
    () => officeEnvironmentManager.getAtmosphere(),
  );
}
