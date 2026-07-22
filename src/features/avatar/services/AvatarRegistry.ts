import {
  AVATAR_ASSETS,
  type AvatarAsset,
  AvatarAssetType,
  AvatarId,
  DEFAULT_AVATAR_ID,
} from "../config/avatarAssets";
import { type AvatarSource, RigType } from "../types";

/**
 * Central avatar registry — the accessor over the avatar asset catalogue
 * (`config/avatarAssets.ts`, the single data source). Components ask by intent,
 * never by URL, and the loader chain resolves through `getLoadOrder()`.
 *
 * A GLB-backed asset is `shipped: true` so the loader attempts it; if the file
 * isn't present yet it resolves to null and the procedural placeholder renders
 * (graceful fallback). The procedural placeholder has no file and is never
 * fetched.
 */
function toSource(asset: AvatarAsset): AvatarSource {
  const isRpm = asset.type === AvatarAssetType.Rpm && asset.glbPath !== null;
  return {
    id: asset.id,
    label: asset.name,
    url: asset.glbPath ?? "",
    shipped: isRpm,
    rig: isRpm ? RigType.ReadyPlayerMe : RigType.Procedural,
  };
}

export const AvatarRegistry = {
  /** The avatar the office renders by default (currently Ready Player Me). */
  getActive(): AvatarSource {
    return toSource(AVATAR_ASSETS[DEFAULT_AVATAR_ID]);
  },

  /** The procedural placeholder — the implicit last resort. */
  getFallback(): AvatarSource {
    return toSource(AVATAR_ASSETS[AvatarId.Placeholder]);
  },

  /**
   * Loadable sources in attempt order. Only GLB-backed (shipped) sources are
   * fetched; the procedural placeholder is the loader's built-in last resort,
   * not a network target — so it never appears here.
   */
  getLoadOrder(): AvatarSource[] {
    return [this.getActive()].filter((source) => source.shipped);
  },

  getAll(): AvatarSource[] {
    return Object.values(AVATAR_ASSETS).map(toSource);
  },

  getById(id: string): AvatarSource | undefined {
    const asset = AVATAR_ASSETS[id as AvatarId];
    return asset ? toSource(asset) : undefined;
  },

  getUrl(id: string): string | undefined {
    return this.getById(id)?.url;
  },

  isShipped(id: string): boolean {
    return this.getById(id)?.shipped ?? false;
  },
};
