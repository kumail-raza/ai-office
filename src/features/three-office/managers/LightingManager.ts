import { LIGHTING_PRESETS } from "../constants";
import { LightingMode, type LightingPreset } from "../types";

/**
 * Owns the active lighting mode for the 3D office. Framework-agnostic
 * (subscribe/getSnapshot) so React reads it via useSyncExternalStore and a
 * future day/night cycle or the window's environment settings can drive it
 * without touching the scene components.
 */
class LightingManager {
  private mode: LightingMode = LightingMode.Day;
  private readonly listeners = new Set<() => void>();

  getMode(): LightingMode {
    return this.mode;
  }

  getPreset(): LightingPreset {
    return LIGHTING_PRESETS[this.mode];
  }

  setMode(mode: LightingMode): void {
    if (mode === this.mode) return;
    this.mode = mode;
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const lightingManager = new LightingManager();
