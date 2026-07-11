import type { Group } from "three";

import { AssetRegistry } from "../assets";
import { AssetStatus, type OfficeAssetId } from "../types";
import { gltfAssetLoader } from "./GltfAssetLoader";

/**
 * Preloads shipped office models and hands out their scene graphs. Assets not
 * in the shipped manifest (or that fail to load) stay Unavailable and render
 * as placeholder geometry. Framework-agnostic: React consumes it through
 * subscribe/getStatus (useSyncExternalStore-compatible), the loader scene just
 * calls preloadAll().
 */
class AssetPreloader {
  private readonly scenes = new Map<OfficeAssetId, Group>();
  private readonly statuses = new Map<OfficeAssetId, AssetStatus>();
  private readonly listeners = new Set<() => void>();
  private started = false;

  /** Kick off loading for every shipped asset. Safe to call more than once. */
  async preloadAll(): Promise<void> {
    if (this.started) return;
    this.started = true;

    await Promise.all(
      AssetRegistry.getShipped().map(async ({ id, url }) => {
        this.setStatus(id, AssetStatus.Loading);
        const scene = await gltfAssetLoader.load(url);
        if (scene) {
          this.scenes.set(id, scene);
          this.setStatus(id, AssetStatus.Ready);
        } else {
          this.setStatus(id, AssetStatus.Unavailable);
        }
      }),
    );
  }

  getStatus(id: OfficeAssetId): AssetStatus {
    return this.statuses.get(id) ?? AssetStatus.Unavailable;
  }

  /** The loaded template scene — callers clone it before mounting. */
  getScene(id: OfficeAssetId): Group | null {
    return this.scenes.get(id) ?? null;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setStatus(id: OfficeAssetId, status: AssetStatus): void {
    this.statuses.set(id, status);
    this.listeners.forEach((listener) => listener());
  }
}

export const assetPreloader = new AssetPreloader();
