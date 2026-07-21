import { AVATAR_PLACEMENT, OBJECT_TRANSFORMS } from "../constants";
import type { ScenePosition } from "../types";

/**
 * The interaction zones that make the office an interactive environment. These
 * are spatial regions, not the registry objects themselves — a zone owns a
 * position, a radius, the registry object it frames (when one exists), and the
 * existing feature experience it bridges to. Positions are DERIVED from the
 * existing constants (OBJECT_TRANSFORMS / AVATAR_PLACEMENT), so no scene
 * coordinates are hardcoded here.
 */
export enum InteractionZoneId {
  DigitalTwin = "digital-twin",
  Projects = "projects",
  Recruiter = "recruiter",
  Profile = "profile",
}

/**
 * Which existing feature experience a zone routes to. `None` is a real value —
 * the Profile zone focuses and reports analytics but has no full experience to
 * open yet (documented as a future seam, not a missing UI).
 */
export enum BridgeTarget {
  Conversation = "conversation",
  Projects = "projects",
  Recruiter = "recruiter",
  None = "none",
}

export interface InteractionZone {
  id: InteractionZoneId;
  label: string;
  /** Zone centre in world space (derived from existing transforms). */
  position: ScenePosition;
  /** Activation radius in world units — the sphere a probe point must enter. */
  radius: number;
  /**
   * Registry object id this zone frames, or null for zones anchored to
   * something without a registry entry (the avatar). Reuses OfficeObjectRegistry
   * ids — the single source of truth — rather than duplicating identity.
   */
  targetObjectId: string | null;
  /** The existing feature experience this zone opens on interaction. */
  bridge: BridgeTarget;
}

const [avatarX, , avatarZ] = AVATAR_PLACEMENT.position;

/**
 * The four zones, anchored to existing world positions:
 *   - Digital Twin  → the avatar's placement (conversation)
 *   - Projects      → the desk monitor (project experience)
 *   - Recruiter     → the awards/certificate wall (recruiter mode)
 *   - Profile       → the bookshelf's personal shelf (focus + analytics only)
 *
 * Radii are sized so each desk/wall object falls into exactly one zone; the
 * window and empty floor resolve to no zone (see InteractionManager).
 */
export const INTERACTION_ZONES: Record<InteractionZoneId, InteractionZone> = {
  [InteractionZoneId.DigitalTwin]: {
    id: InteractionZoneId.DigitalTwin,
    label: "Digital Twin",
    position: [avatarX, 1.2, avatarZ],
    radius: 1.5,
    targetObjectId: null,
    bridge: BridgeTarget.Conversation,
  },
  [InteractionZoneId.Projects]: {
    id: InteractionZoneId.Projects,
    label: "Projects Area",
    position: OBJECT_TRANSFORMS.monitor.position,
    radius: 1.5,
    targetObjectId: "monitor",
    bridge: BridgeTarget.Projects,
  },
  [InteractionZoneId.Recruiter]: {
    id: InteractionZoneId.Recruiter,
    label: "Recruiter Area",
    position: OBJECT_TRANSFORMS.certificate.position,
    radius: 1.6,
    targetObjectId: "certificate",
    bridge: BridgeTarget.Recruiter,
  },
  [InteractionZoneId.Profile]: {
    id: InteractionZoneId.Profile,
    label: "Profile Area",
    position: OBJECT_TRANSFORMS.bookshelf.position,
    radius: 1.6,
    targetObjectId: "bookshelf",
    bridge: BridgeTarget.None,
  },
};

/** Zones as a list, for spatial scans. */
export const INTERACTION_ZONE_LIST: InteractionZone[] = Object.values(INTERACTION_ZONES);
