import type { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Thin, cached abstraction over three's GLTFLoader. Fetches the file itself so
 * a missing asset resolves quietly to `null` (placeholder territory) instead of
 * throwing or spamming the console, and parses the buffer off the fetched
 * response. Every URL is loaded at most once per session.
 */
class GltfAssetLoader {
  private readonly loader = new GLTFLoader();
  private readonly cache = new Map<string, Promise<Group | null>>();

  /** Resolve a .glb URL to its scene graph, or null when unavailable. */
  load(url: string): Promise<Group | null> {
    let pending = this.cache.get(url);
    if (!pending) {
      pending = this.fetchAndParse(url);
      this.cache.set(url, pending);
    }
    return pending;
  }

  private async fetchAndParse(url: string): Promise<Group | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const buffer = await response.arrayBuffer();
      const gltf = await this.loader.parseAsync(buffer, url);
      return gltf.scene;
    } catch {
      // Network failure or malformed file — the caller falls back to the
      // placeholder mesh; a broken asset must never crash the app.
      return null;
    }
  }
}

export const gltfAssetLoader = new GltfAssetLoader();
