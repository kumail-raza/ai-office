/**
 * The single catalogue of avatar assets the office can render. The
 * AvatarRegistry reads from this (it is the accessor; this is the data), so
 * the *only* thing that changes to swap avatars is a line in this file.
 */
export enum AvatarId {
  /** The primitive fallback figure — no file, always available. */
  Placeholder = "placeholder",
  /** The default: a Ready Player Me .glb. */
  ReadyPlayerMe = "ready-player-me",
}

/** How an asset is realised: procedural primitives vs. a loaded rig. */
export enum AvatarAssetType {
  Procedural = "procedural",
  Rpm = "rpm",
}

export interface AvatarAsset {
  id: AvatarId;
  name: string;
  /** Public path of the .glb, or null for the procedural placeholder. */
  glbPath: string | null;
  type: AvatarAssetType;
}

const BASE = "/assets/avatars";

export const AVATAR_ASSETS: Record<AvatarId, AvatarAsset> = {
  [AvatarId.Placeholder]: {
    id: AvatarId.Placeholder,
    name: "Placeholder",
    glbPath: null,
    type: AvatarAssetType.Procedural,
  },
  [AvatarId.ReadyPlayerMe]: {
    id: AvatarId.ReadyPlayerMe,
    name: "Ready Player Me",
    // ── FUTURE kumail.glb SWAP POINT ─────────────────────────────────────
    // To ship the custom twin, change ONLY this path to `${BASE}/kumail.glb`
    // (a Ready Player Me export → same rig, same pipeline). No code changes.
    glbPath: `${BASE}/ReadyPlayerMe.glb`,
    type: AvatarAssetType.Rpm,
  },
};

/** The avatar the office renders by default. */
export const DEFAULT_AVATAR_ID = AvatarId.ReadyPlayerMe;
