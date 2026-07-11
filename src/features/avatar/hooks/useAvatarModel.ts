"use client";

import { AvatarRegistry } from "../services/AvatarRegistry";
import { avatarLoader } from "../services/AvatarLoader";
import type { AvatarSource, LoadedAvatar } from "../types";

type CacheEntry =
  | { status: "resolved"; value: LoadedAvatar | null }
  | { status: "pending"; promise: Promise<void> };

const cache = new Map<string, CacheEntry>();

/**
 * Suspense-friendly avatar loader. Unshipped sources resolve to `null`
 * immediately (no network request, no 404 noise) so the procedural fallback
 * renders without ever suspending. A shipped source suspends the nearest
 * <Suspense> boundary until its model resolves, then returns it — or `null` if
 * the file is missing/broken, so the fallback still renders instead of crashing.
 */
export function useAvatarModel(source: AvatarSource): LoadedAvatar | null {
  const key = source.url;

  if (!source.shipped) return null;

  const entry = cache.get(key);

  if (!entry) {
    const record: CacheEntry = {
      status: "pending",
      promise: avatarLoader.load(key).then((value) => {
        cache.set(key, { status: "resolved", value });
      }),
    };
    cache.set(key, record);
    throw record.promise;
  }

  if (entry.status === "pending") throw entry.promise;
  return entry.value;
}

/** Convenience: load the office's active avatar. */
export function useActiveAvatarModel(): LoadedAvatar | null {
  return useAvatarModel(AvatarRegistry.getActive());
}
