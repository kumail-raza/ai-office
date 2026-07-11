import {
  type CameraPose,
  LightingMode,
  type LightingPreset,
  OfficeMeshKind,
  type OfficeMeshTransform,
  type ScenePosition,
} from "../types";

/**
 * 3D transforms for interactive registry objects, keyed by registry object id.
 * The OfficeObjectRegistry stays the single source of truth for identity and
 * behaviour; this map only positions each object in the 3D room.
 */
export const OBJECT_TRANSFORMS: Record<string, OfficeMeshTransform> = {
  monitor: { kind: OfficeMeshKind.Monitor, position: [0, 1.06, -0.55] },
  certificate: { kind: OfficeMeshKind.Certificate, position: [-2.4, 2.1, -2.9] },
  bookshelf: { kind: OfficeMeshKind.Bookshelf, position: [-3.3, 0, -1.2], rotationY: Math.PI / 2 },
  coffee: { kind: OfficeMeshKind.Coffee, position: [0.75, 1.03, -0.35] },
  window: { kind: OfficeMeshKind.Window, position: [1.9, 1.7, -2.94] },
};

/** Non-interactive set dressing (not part of the registry). */
export const DECOR_TRANSFORMS: OfficeMeshTransform[] = [
  { kind: OfficeMeshKind.Desk, position: [0, 0, -0.5] },
  { kind: OfficeMeshKind.Chair, position: [0, 0, 0.55], rotationY: Math.PI },
  { kind: OfficeMeshKind.Plant, position: [3.1, 0, -2.4] },
  { kind: OfficeMeshKind.Plant, position: [-2.9, 0, -2.6] },
];

/** Where the digital twin will stand/sit once a 3D avatar exists. */
export const AVATAR_ANCHOR_POSITION: ScenePosition = [0, 0.55, 0.55];

/** Default camera pose (room overview) and framing distance when focusing. */
export const DEFAULT_CAMERA_POSE: CameraPose = {
  position: [0, 1.65, 3.4],
  target: [0, 1, -0.6],
};

export const CAMERA_CONFIG = {
  fov: 50,
  near: 0.1,
  far: 60,
  /** Approach distance when focusing an object. */
  focusDistance: 1.7,
  /** Height offset applied to the focus eye position. */
  focusLift: 0.35,
  /** Per-frame smoothing factors (0–1; higher = snappier). */
  positionSmoothing: 0.055,
  targetSmoothing: 0.08,
  /** Idle drift amplitude (world units) and speed (cycles/sec). */
  idleAmplitude: 0.06,
  idleSpeed: 0.1,
} as const;

const DAY: LightingPreset = {
  implemented: true,
  background: "#dfe7f2",
  fog: { color: "#dfe7f2", near: 8, far: 24 },
  ambient: { intensity: 0.55, color: "#ffffff" },
  hemisphere: { skyColor: "#eaf2ff", groundColor: "#cdbfa8", intensity: 0.7 },
  directional: { position: [4, 6, 3], intensity: 1.6, color: "#fff4e0" },
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

/** Room shell dimensions (floor plane + back/side walls). */
export const ROOM = {
  width: 8,
  depth: 7,
  height: 3.2,
  floorColor: "#c9b18f",
  wallColor: "#efe6d6",
} as const;
