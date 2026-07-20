import {
  type CameraPose,
  CameraZone,
  LightingMode,
  type LightingPreset,
  OfficeMeshKind,
  type OfficeMeshTransform,
} from "../types";

import { CAMERA_ZONES } from "./cameraZones";

export { AVATAR_PLACEMENT, CAMERA_ZONES, OBJECT_CAMERA_ZONE } from "./cameraZones";

/**
 * 3D transforms for interactive registry objects, keyed by registry object id.
 * The OfficeObjectRegistry stays the single source of truth for identity and
 * behaviour; this map only positions each object in the 3D room.
 */
export const OBJECT_TRANSFORMS: Record<string, OfficeMeshTransform> = {
  monitor: { kind: OfficeMeshKind.Monitor, position: [0, 1.035, -0.58] },
  certificate: { kind: OfficeMeshKind.Certificate, position: [-2.4, 1.98, -2.92] },
  bookshelf: { kind: OfficeMeshKind.Bookshelf, position: [-3.28, 0, -1.2], rotationY: Math.PI / 2 },
  coffee: { kind: OfficeMeshKind.Coffee, position: [0.78, 1.035, -0.3] },
  window: { kind: OfficeMeshKind.Window, position: [1.9, 1.7, -2.94] },
};

/** The resting overview pose is the Entry camera zone. */
export const DEFAULT_CAMERA_POSE: CameraPose = CAMERA_ZONES[CameraZone.Entry];

export const CAMERA_CONFIG = {
  fov: 42, // longer lens — less perspective distortion, more cinematic
  near: 0.1,
  far: 60,
  /** Approach distance when focusing an object. */
  focusDistance: 1.9,
  /** Height offset applied to the focus eye position. */
  focusLift: 0.32,
  /** Seconds for a full eased move between vantage points. */
  transitionSeconds: 1.8,
  /** Idle drift amplitude (world units) and speed (cycles/sec) — a slow breath. */
  idleAmplitude: 0.045,
  idleSpeed: 0.07,
} as const;

/**
 * Late-afternoon light in a corner office: a warm low sun raking in through the
 * window, a cool bounce filling the shadow side, and a soft ambient floor.
 * Deliberately low-contrast — no blown highlights, no black shadows.
 */
const DAY: LightingPreset = {
  implemented: true,
  background: "#b9b0a2",
  fog: { color: "#b9b0a2", near: 7, far: 24 },
  ambient: { intensity: 0.38, color: "#fff3e2" },
  hemisphere: { skyColor: "#e8f0fb", groundColor: "#7a5c40", intensity: 0.5 },
  directional: { position: [5.5, 5.5, -2.5], intensity: 2.1, color: "#ffe8c4" },
  fill: { position: [-5, 3, 4], intensity: 0.5, color: "#bcd0e8" },
  environment: { intensity: 0.45 },
  shadow: { radius: 6, opacity: 0.42, bias: -0.0006 },
};

/**
 * Lighting recipes per mode. Only Day is authored; the rest are placeholders
 * that reuse the Day recipe (flagged `implemented: false`) until each gets its
 * own pass — callers can switch modes today without breaking.
 */
export const LIGHTING_PRESETS: Record<LightingMode, LightingPreset> = {
  [LightingMode.Day]: DAY,
  [LightingMode.Morning]: { ...DAY, implemented: false },
  [LightingMode.Evening]: { ...DAY, implemented: false },
  [LightingMode.Night]: { ...DAY, implemented: false },
  [LightingMode.Cyberpunk]: { ...DAY, implemented: false },
};

/** Room shell dimensions. Surfaces use MaterialKind presets, not colours. */
export const ROOM = {
  width: 8,
  depth: 7,
  height: 3.2,
} as const;
