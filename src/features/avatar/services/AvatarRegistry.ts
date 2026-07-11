import type { AvatarSource } from "../types";

/** All avatar models live under this public path. */
const AVATAR_BASE_PATH = "/models/avatar";

/**
 * The avatar the office renders. Point `url` at a .glb/.gltf (Ready Player Me,
 * Mixamo, custom, MetaHuman export) and flip `shipped` to true once the file is
 * in /public — nothing else changes. Shipped=false keeps the graceful
 * procedural fallback and skips the network request entirely (no 404 noise).
 */
const PRIMARY_AVATAR: AvatarSource = {
  id: "primary",
  url: `${AVATAR_BASE_PATH}/kumail.glb`,
  shipped: false,
};

/**
 * Central avatar registry — the only place that knows an avatar file path.
 * Components ask the registry (via the loader hook) by intent, never by URL.
 */
export const AvatarRegistry = {
  getActive(): AvatarSource {
    return PRIMARY_AVATAR;
  },

  getById(id: string): AvatarSource | undefined {
    return id === PRIMARY_AVATAR.id ? PRIMARY_AVATAR : undefined;
  },

  getUrl(id: string): string | undefined {
    return this.getById(id)?.url;
  },

  isShipped(id: string): boolean {
    return this.getById(id)?.shipped ?? false;
  },
};
