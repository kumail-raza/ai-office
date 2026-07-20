"use client";

import { AvatarRegistry } from "../services/AvatarRegistry";
import { avatarLoader } from "../services/AvatarLoader";
import type { AvatarSource, LoadedAvatar } from "../types";

/** What the loader chain resolved: a model and which source it came from. */
export interface ResolvedAvatar {
  loaded: LoadedAvatar | null;
  /** The registry source that loaded, or null when the procedural figure renders. */
  source: AvatarSource | null;
}

type CacheEntry =
  | { status: "resolved"; value: ResolvedAvatar }
  | { status: "pending"; promise: Promise<void> };

const cache = new Map<string, CacheEntry>();

const PROCEDURAL: ResolvedAvatar = { loaded: null, source: null };

/** Try each source in order; first model that parses wins. */
async function loadFirst(sources: AvatarSource[]): Promise<ResolvedAvatar> {
  for (const source of sources) {
    const value = await avatarLoader.load(source.url);
    if (value) return { loaded: value, source };
  }
  return PROCEDURAL;
}

/**
 * Suspense-friendly avatar loader with graceful degradation. Unshipped sources
 * are skipped outright (no network request, no 404 noise), so with nothing
 * shipped the procedural fallback renders without ever suspending. Shipped
 * sources are attempted in order inside one suspension: active model first,
 * then the registry fallback, then the procedural figure — a missing or broken
 * file can only ever soften the result, never crash it.
 */
export function useAvatarChain(sources: AvatarSource[]): ResolvedAvatar {
  const shipped = sources.filter((source) => source.shipped);
  if (shipped.length === 0) return PROCEDURAL;

  const key = shipped.map((source) => source.url).join(" -> ");
  const entry = cache.get(key);

  if (!entry) {
    const record: CacheEntry = {
      status: "pending",
      promise: loadFirst(shipped).then((value) => {
        cache.set(key, { status: "resolved", value });
      }),
    };
    cache.set(key, record);
    throw record.promise;
  }

  if (entry.status === "pending") throw entry.promise;
  return entry.value;
}

/** Load a single registry source (no fallback chain). */
export function useAvatarModel(source: AvatarSource): LoadedAvatar | null {
  return useAvatarChain([source]).loaded;
}

/** Load the office's active avatar through the registry's fallback order. */
export function useActiveAvatarModel(): ResolvedAvatar {
  return useAvatarChain(AvatarRegistry.getLoadOrder());
}
