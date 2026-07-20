import { CameraZone, OfficeArea, OfficeMeshKind, type OfficeMeshTransform } from "../types";

/**
 * One independently-configurable region of the office. A zone owns its set
 * dressing (decor), the registry objects that live in it, and the camera zone
 * that frames it. Toggle `enabled` to compose a different room without touching
 * any scene component.
 */
export interface ZoneConfig {
  id: OfficeArea;
  label: string;
  enabled: boolean;
  /** OfficeObjectRegistry ids that belong to this zone (interactive). */
  objectIds: string[];
  /** Non-interactive set dressing placed within the zone. */
  decor: OfficeMeshTransform[];
  /** The camera vantage point that best frames this zone. */
  cameraZone: CameraZone;
}

/**
 * The office, zone by zone. Positions are world-space; the room is 8 wide
 * (x −4…4) × 7 deep (z −3.5…3.5) × 3.2 tall, with the visitor entering from +z.
 */
export const OFFICE_ZONES: Record<OfficeArea, ZoneConfig> = {
  /* Where the visitor arrives — a rug and greenery so the foreground isn't bare. */
  [OfficeArea.Entrance]: {
    id: OfficeArea.Entrance,
    label: "Entrance",
    enabled: true,
    objectIds: [],
    cameraZone: CameraZone.Entry,
    decor: [
      { kind: OfficeMeshKind.Rug, position: [0, 0, 0.35] },
      { kind: OfficeMeshKind.Plant, position: [3.15, 0, 1.7] },
    ],
  },

  /* The executive desk: desk, chair, and a deliberate spread of accessories. */
  [OfficeArea.Desk]: {
    id: OfficeArea.Desk,
    label: "Executive Desk",
    enabled: true,
    objectIds: ["monitor", "coffee"],
    cameraZone: CameraZone.Desk,
    decor: [
      { kind: OfficeMeshKind.Desk, position: [0, 0, -0.5] },
      { kind: OfficeMeshKind.Chair, position: [0, 0, 0.55], rotationY: Math.PI },
      { kind: OfficeMeshKind.Notebook, position: [-0.62, 1.03, -0.28], rotationY: 0.22 },
      { kind: OfficeMeshKind.PenCup, position: [-0.95, 1.03, -0.52] },
      { kind: OfficeMeshKind.DeskLamp, position: [1.02, 1.03, -0.72], rotationY: -0.5 },
    ],
  },

  /* A tall walnut shelf with books, a trophy, a framed photo and a plant. */
  [OfficeArea.Bookshelf]: {
    id: OfficeArea.Bookshelf,
    label: "Bookshelf",
    enabled: true,
    objectIds: ["bookshelf"],
    cameraZone: CameraZone.Bookshelf,
    decor: [{ kind: OfficeMeshKind.Sideboard, position: [-3.3, 0, 1.4], rotationY: Math.PI / 2 }],
  },

  /* The achievement wall: the interactive certificate plus a framed gallery. */
  [OfficeArea.Awards]: {
    id: OfficeArea.Awards,
    label: "Awards & Certificates",
    enabled: true,
    objectIds: ["certificate"],
    cameraZone: CameraZone.Bookshelf,
    decor: [
      { kind: OfficeMeshKind.AwardPlaque, position: [-1.55, 2.22, -2.92] },
      { kind: OfficeMeshKind.AwardPlaque, position: [-1.55, 1.72, -2.92] },
      { kind: OfficeMeshKind.FramedPhoto, position: [-3.14, 1.95, -2.92] },
    ],
  },

  /* The window wall, with the city beyond it. */
  [OfficeArea.Window]: {
    id: OfficeArea.Window,
    label: "Window",
    enabled: true,
    objectIds: ["window"],
    cameraZone: CameraZone.Window,
    decor: [{ kind: OfficeMeshKind.WindowBackdrop, position: [1.9, 1.7, -3.6] }],
  },

  /* Ambient greenery and depth props that tie the room together. */
  [OfficeArea.Decoration]: {
    id: OfficeArea.Decoration,
    label: "Decoration",
    enabled: true,
    objectIds: [],
    cameraZone: CameraZone.Entry,
    decor: [
      { kind: OfficeMeshKind.Plant, position: [-2.85, 0, -2.55] },
      { kind: OfficeMeshKind.Trophy, position: [-3.3, 0.92, 1.1], rotationY: Math.PI / 2 },
    ],
  },

  /* Reserved for the digital twin's body (rendered by the avatar feature). */
  [OfficeArea.Avatar]: {
    id: OfficeArea.Avatar,
    label: "Avatar",
    enabled: true,
    objectIds: [],
    cameraZone: CameraZone.Avatar,
    decor: [],
  },
};

/** Zones in render order (kept explicit so layering is intentional). */
export const ZONE_ORDER: OfficeArea[] = [
  OfficeArea.Entrance,
  OfficeArea.Window,
  OfficeArea.Awards,
  OfficeArea.Bookshelf,
  OfficeArea.Desk,
  OfficeArea.Decoration,
  OfficeArea.Avatar,
];
