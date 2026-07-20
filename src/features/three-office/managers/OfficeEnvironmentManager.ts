import { OFFICE_ZONES, ZONE_ORDER, type ZoneConfig } from "../environment/zones";
import {
  type AtmosphereConfig,
  BackdropMode,
  type LightingMode,
  type LightingPreset,
  type OfficeArea,
} from "../types";
import { lightingManager } from "./LightingManager";

/**
 * The authority for what the office *is*: which zones compose the room, where
 * their props sit, how the scene is lit, and the atmosphere around it. Scene
 * components read this rather than owning layout themselves, so the environment
 * can be recomposed (zones toggled, backdrop swapped, mode changed) from one
 * place. Framework-agnostic — React subscribes via useOfficeEnvironment.
 */
class OfficeEnvironmentManager {
  private readonly zones: Record<OfficeArea, ZoneConfig> = structuredClone(OFFICE_ZONES);
  private atmosphere: AtmosphereConfig = {
    backdrop: BackdropMode.City,
    practicals: true,
    depthHaze: 0.6,
  };

  private readonly listeners = new Set<() => void>();

  /* ---- Composition ---------------------------------------------------- */

  /** Enabled zones, in intentional render order. */
  getZones(): ZoneConfig[] {
    return ZONE_ORDER.map((area) => this.zones[area]).filter((zone) => zone.enabled);
  }

  getZone(area: OfficeArea): ZoneConfig {
    return this.zones[area];
  }

  /** Toggle a whole region of the room on or off. */
  setZoneEnabled(area: OfficeArea, enabled: boolean): void {
    if (this.zones[area].enabled === enabled) return;
    this.zones[area].enabled = enabled;
    this.notify();
  }

  /** Registry object ids that belong to a zone (asset placement lookup). */
  getObjectIds(area: OfficeArea): string[] {
    return this.zones[area].objectIds;
  }

  /* ---- Lighting -------------------------------------------------------- */

  getLightingMode(): LightingMode {
    return lightingManager.getMode();
  }

  setLightingMode(mode: LightingMode): void {
    lightingManager.setMode(mode);
  }

  getLightingPreset(): LightingPreset {
    return lightingManager.getPreset();
  }

  /* ---- Atmosphere ------------------------------------------------------ */

  getAtmosphere(): AtmosphereConfig {
    return this.atmosphere;
  }

  /** Swap what's visible through the window (sky / city / landscape). */
  setBackdrop(backdrop: BackdropMode): void {
    if (this.atmosphere.backdrop === backdrop) return;
    this.atmosphere = { ...this.atmosphere, backdrop };
    this.notify();
  }

  setPracticals(enabled: boolean): void {
    if (this.atmosphere.practicals === enabled) return;
    this.atmosphere = { ...this.atmosphere, practicals: enabled };
    this.notify();
  }

  /* ---- Subscription ---------------------------------------------------- */

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    const unsubscribeLighting = lightingManager.subscribe(listener);
    return () => {
      this.listeners.delete(listener);
      unsubscribeLighting();
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const officeEnvironmentManager = new OfficeEnvironmentManager();
