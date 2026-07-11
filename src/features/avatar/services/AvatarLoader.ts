import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import type { LoadedAvatar } from "../types";

/**
 * Loads an avatar .glb/.gltf, keeping its animation clips (unlike the office
 * asset loader, which only needs static scenes). Fetches the file itself so a
 * missing/broken model resolves quietly to `null` — the caller renders the
 * procedural fallback instead of crashing. Cached per URL for the session.
 */
class AvatarLoader {
  private readonly loader = new GLTFLoader();
  private readonly cache = new Map<string, Promise<LoadedAvatar | null>>();

  load(url: string): Promise<LoadedAvatar | null> {
    let pending = this.cache.get(url);
    if (!pending) {
      pending = this.fetchAndParse(url);
      this.cache.set(url, pending);
    }
    return pending;
  }

  private async fetchAndParse(url: string): Promise<LoadedAvatar | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const buffer = await response.arrayBuffer();
      const gltf = await this.loader.parseAsync(buffer, url);
      return { scene: gltf.scene, animations: gltf.animations };
    } catch {
      return null;
    }
  }
}

export const avatarLoader = new AvatarLoader();
