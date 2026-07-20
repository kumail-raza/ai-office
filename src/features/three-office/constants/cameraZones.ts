import { type CameraPose, CameraZone, type ScenePosition } from "../types";

/**
 * Where and how the avatar stands in the room — the single source of the
 * avatar's world placement. Standing just in front of the desk/chair, facing
 * the visitor (rotationY 0 → toward the Entry camera). The avatar feature's
 * OfficeAvatar consumes this as a prop, so no coordinates live in components.
 */
export const AVATAR_PLACEMENT = {
  /* Beside the desk rather than dead-centre, so it never blocks the room. */
  position: [1.15, 0, 0.75] as ScenePosition,
  rotationY: -0.22,
  scale: 1,
};

const [ax, , az] = AVATAR_PLACEMENT.position;

/**
 * Predefined vantage points around the office, framed for the 42° lens. Entry
 * is an angled establishing shot that reads the whole room; the rest frame
 * their region for object focus and future cinematic paths. The Avatar zone is
 * derived from AVATAR_PLACEMENT so it tracks the avatar if it moves.
 */
export const CAMERA_ZONES: Record<CameraZone, CameraPose> = {
  [CameraZone.Entry]: { position: [1.35, 2.05, 5.5], target: [-0.35, 1.05, -1.1] },
  [CameraZone.Desk]: { position: [0.55, 1.8, 2.35], target: [0, 1.12, -0.62] },
  [CameraZone.Bookshelf]: { position: [-0.85, 1.75, 0.15], target: [-3.15, 1.2, -1.2] },
  [CameraZone.Window]: { position: [1.6, 1.85, 0.5], target: [1.9, 1.62, -2.9] },
  [CameraZone.Avatar]: { position: [ax + 0.85, 1.6, az + 2.7], target: [ax, 1.2, az] },
};

/** Registry object id → the camera zone that best frames it. */
export const OBJECT_CAMERA_ZONE: Record<string, CameraZone> = {
  monitor: CameraZone.Desk,
  coffee: CameraZone.Desk,
  bookshelf: CameraZone.Bookshelf,
  window: CameraZone.Window,
  // certificate has no dedicated zone — generic object focus frames it.
};

/*
 * Object → zone assignment now lives with each zone's config in
 * environment/zones.ts (ZoneConfig.objectIds), so a zone owns its contents.
 */
