import { type CameraPose, CameraZone, OfficeArea, type ScenePosition } from "../types";

/**
 * Where and how the avatar stands in the room — the single source of the
 * avatar's world placement. Standing just in front of the desk/chair, facing
 * the visitor (rotationY 0 → toward the Entry camera). The avatar feature's
 * OfficeAvatar consumes this as a prop, so no coordinates live in components.
 */
export const AVATAR_PLACEMENT = {
  position: [0, 0, 1.15] as ScenePosition,
  rotationY: 0,
  scale: 1,
};

const [ax, , az] = AVATAR_PLACEMENT.position;

/**
 * Predefined vantage points around the office. Entry doubles as the resting
 * overview pose; the rest frame their region for object focus and future
 * cinematic paths / project showcases. The Avatar zone frames the avatar
 * (derived from AVATAR_PLACEMENT so it tracks the avatar if it moves).
 */
export const CAMERA_ZONES: Record<CameraZone, CameraPose> = {
  [CameraZone.Entry]: { position: [0, 1.65, 3.4], target: [0, 1, -0.6] },
  [CameraZone.Desk]: { position: [0.3, 1.5, 1.5], target: [0, 1.2, -0.55] },
  [CameraZone.Bookshelf]: { position: [-1.6, 1.4, 0.6], target: [-3.3, 1.1, -1.2] },
  [CameraZone.Window]: { position: [1.2, 1.6, -0.8], target: [1.9, 1.7, -2.94] },
  [CameraZone.Avatar]: { position: [ax + 0.75, 1.5, az + 1.85], target: [ax, 1.35, az] },
};

/** Registry object id → the camera zone that best frames it. */
export const OBJECT_CAMERA_ZONE: Record<string, CameraZone> = {
  monitor: CameraZone.Desk,
  coffee: CameraZone.Desk,
  bookshelf: CameraZone.Bookshelf,
  window: CameraZone.Window,
  // certificate has no dedicated zone — generic object focus frames it.
};

/** Registry object id → the environment area that renders it. */
export const AREA_OBJECT_IDS: Record<OfficeArea, string[]> = {
  [OfficeArea.Desk]: ["monitor", "coffee"],
  [OfficeArea.Bookshelf]: ["bookshelf"],
  [OfficeArea.Window]: ["window"],
  [OfficeArea.Decoration]: ["certificate"],
  [OfficeArea.Avatar]: [],
};
