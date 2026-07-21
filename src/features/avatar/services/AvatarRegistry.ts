import { type AvatarSource, RigType } from "../types";

/** All avatar models live under this public path. */
const AVATAR_BASE_PATH = "/assets/avatars";

/**
 * Every avatar the office knows how to render. Drop the matching .glb into
 * public/assets/avatars/ and flip `shipped` to true — nothing else changes.
 * Shipped=false keeps the graceful procedural fallback and skips the network
 * request entirely (no 404 noise). `clipOverrides` is the seam for models
 * whose clip naming differs from the shared candidate table.
 */
const AVATARS: Record<string, AvatarSource> = {
  kumail: {
    id: "kumail",
    label: "Kumail (Ready Player Me digital twin)",
    url: `${AVATAR_BASE_PATH}/kumail-rpm.glb`,
    shipped: true,
    rig: RigType.ReadyPlayerMe,
  },
  "ready-player-me": {
    id: "ready-player-me",
    label: "Ready Player Me (generic)",
    url: `${AVATAR_BASE_PATH}/ready-player-me.glb`,
    shipped: false,
    rig: RigType.ReadyPlayerMe,
  },
  "fallback-avatar": {
    id: "fallback-avatar",
    label: "Fallback humanoid",
    url: `${AVATAR_BASE_PATH}/fallback-avatar.glb`,
    shipped: false,
    rig: RigType.GenericGltf,
  },
};

const ACTIVE_ID = "kumail";
const FALLBACK_ID = "fallback-avatar";

/**
 * Central avatar registry — the only place that knows an avatar file path.
 * Components ask the registry (via the loader hook) by intent, never by URL.
 */
export const AvatarRegistry = {
  /** The avatar the office renders by default. */
  getActive(): AvatarSource {
    return AVATARS[ACTIVE_ID];
  },

  /** The model tried when the active one is missing or broken. */
  getFallback(): AvatarSource {
    return AVATARS[FALLBACK_ID];
  },

  /**
   * Sources in the order the loader should attempt them: active first, then
   * the fallback model; the procedural figure is the implicit last resort.
   */
  getLoadOrder(): AvatarSource[] {
    const active = this.getActive();
    const fallback = this.getFallback();
    return active.id === fallback.id ? [active] : [active, fallback];
  },

  getAll(): AvatarSource[] {
    return Object.values(AVATARS);
  },

  getById(id: string): AvatarSource | undefined {
    return AVATARS[id];
  },

  getUrl(id: string): string | undefined {
    return this.getById(id)?.url;
  },

  isShipped(id: string): boolean {
    return this.getById(id)?.shipped ?? false;
  },
};
