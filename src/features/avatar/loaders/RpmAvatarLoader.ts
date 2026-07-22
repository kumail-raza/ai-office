import type { AnimationClip, Group, Mesh, SkinnedMesh } from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

import { avatarLoader } from "../services/AvatarLoader";
import type { LoadedAvatar } from "../types";

/** A render-ready RPM instance plus what the loader detected in it. */
export interface RpmAvatarInstance {
  /** A skeleton-safe clone — the object that gets mounted. */
  scene: Group;
  animations: AnimationClip[];
  /** Skinned meshes found in the clone (RPM bodies are skinned). */
  skinnedMeshes: SkinnedMesh[];
  /** Whether a bound skeleton was found (skinned mesh present). */
  hasSkeleton: boolean;
  /** Total facial/blend morph targets across all meshes. */
  morphTargetCount: number;
}

/**
 * Loads and instantiates Ready Player Me avatars.
 *
 * Loading reuses the shared `avatarLoader` (one fetch/parse/cache path for the
 * whole app — no second loader). Instantiation is the RPM-specific part: a
 * **skeleton-safe deep clone** (each mount needs its own skeleton binding, so a
 * plain `scene.clone()` would break skinning), shadows enabled, frustum culling
 * disabled on skinned meshes (they can be wrongly culled once posed), and
 * detection of skinned meshes / skeleton / facial morph targets for the debug
 * panel. Vendor-neutral: any RPM-style export flows through unchanged, which is
 * exactly what lets a future `kumail.glb` swap in via the registry alone.
 */
class RpmAvatarLoader {
  /** Fetch + parse the source model (cached per URL by the shared loader). */
  load(url: string): Promise<LoadedAvatar | null> {
    return avatarLoader.load(url);
  }

  /** Produce a fresh, render-ready clone of an already-loaded source. */
  instantiate(loaded: LoadedAvatar): RpmAvatarInstance {
    const scene = cloneSkeleton(loaded.scene) as Group;

    const skinnedMeshes: SkinnedMesh[] = [];
    let morphTargetCount = 0;

    scene.traverse((node) => {
      const mesh = node as Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // Skinned meshes deform outside their original bounds once posed;
        // keep them drawn rather than culled.
        mesh.frustumCulled = false;
        if (mesh.morphTargetDictionary) {
          morphTargetCount += Object.keys(mesh.morphTargetDictionary).length;
        }
      }
      const skinned = node as SkinnedMesh;
      if (skinned.isSkinnedMesh) skinnedMeshes.push(skinned);
    });

    return {
      scene,
      animations: loaded.animations,
      skinnedMeshes,
      hasSkeleton: skinnedMeshes.length > 0,
      morphTargetCount,
    };
  }
}

export const rpmAvatarLoader = new RpmAvatarLoader();
