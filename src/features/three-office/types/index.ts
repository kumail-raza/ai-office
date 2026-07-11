import type { OfficeObject } from "@/features/office";

/** Time-of-day / stylized lighting modes. Only Day is implemented today. */
export enum LightingMode {
  Morning = "morning",
  Day = "day",
  Evening = "evening",
  Night = "night",
  Cyberpunk = "cyberpunk",
}

/** A tuple position in scene units (three.js world space). */
export type ScenePosition = [x: number, y: number, z: number];

/** Directional light description within a lighting preset. */
export interface DirectionalLightPreset {
  position: ScenePosition;
  intensity: number;
  color: string;
}

/** Complete lighting recipe for one mode. */
export interface LightingPreset {
  /** Whether the preset is fully authored (false = placeholder). */
  implemented: boolean;
  background: string;
  fog: { color: string; near: number; far: number } | null;
  ambient: { intensity: number; color: string };
  hemisphere: { skyColor: string; groundColor: string; intensity: number };
  directional: DirectionalLightPreset;
}

/** Which placeholder mesh a scene node renders. */
export enum OfficeMeshKind {
  Desk = "desk",
  Monitor = "monitor",
  Chair = "chair",
  Plant = "plant",
  Certificate = "certificate",
  Bookshelf = "bookshelf",
  Window = "window",
  Coffee = "coffee",
}

/**
 * 3D placement for a mesh. Interactive nodes reference a registry object id —
 * the OfficeObjectRegistry remains the single source of truth for identity,
 * naming, and actions; this map only supplies the 3D transform.
 */
export interface OfficeMeshTransform {
  kind: OfficeMeshKind;
  position: ScenePosition;
  rotationY?: number;
}

/** An interactive scene node: registry object + its 3D transform. */
export interface ThreeOfficeNode {
  object: OfficeObject;
  transform: OfficeMeshTransform;
}

/** Camera pose used by CameraController targets. */
export interface CameraPose {
  position: ScenePosition;
  target: ScenePosition;
}
