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
  /** Procedural environment-map contribution (null = none). */
  environment: { intensity: number } | null;
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

/** Predefined camera vantage points around the office. */
export enum CameraZone {
  Entry = "entry",
  Desk = "desk",
  Bookshelf = "bookshelf",
  Window = "window",
  Avatar = "avatar",
}

/** What the scene camera is currently doing. */
export type CameraView =
  | { kind: "zone"; zone: CameraZone }
  | { kind: "focus"; position: ScenePosition };

/** Compositional regions of the office environment. */
export enum OfficeArea {
  Desk = "desk",
  Bookshelf = "bookshelf",
  Window = "window",
  Decoration = "decoration",
  Avatar = "avatar",
}

/* ---- Asset pipeline ---- */

/** Every model the office can load. Files may not exist yet — see the manifest. */
export enum OfficeAssetId {
  Desk = "desk",
  Chair = "chair",
  Monitor = "monitor",
  Bookshelf = "bookshelf",
  Plant = "plant",
  Certificate = "certificate",
  Window = "window",
}

export interface AssetDefinition {
  id: OfficeAssetId;
  /** Public URL of the .glb file. Only the asset registry knows paths. */
  url: string;
}

/** Lifecycle of a registered asset. */
export enum AssetStatus {
  /** Not in the shipped manifest (or failed to load) — placeholder renders. */
  Unavailable = "unavailable",
  Loading = "loading",
  Ready = "ready",
}
