"use client";

import { useEffect, useMemo } from "react";
import type { AnimationClip } from "three";

import { ExpressionAdapter, RigAdapter } from "../../adapters";
import type { FaceRig } from "../../face";
import { rpmAvatarLoader } from "../../loaders/RpmAvatarLoader";
import { avatarStatus } from "../../presence/avatarStatus";
import type { AvatarRig, LoadedAvatar, RigMetadata } from "../../types";

export interface RpmAvatarProps {
  /** The parsed source model (loaded upstream through the Suspense boundary). */
  loaded: LoadedAvatar;
  /** Reports the mounted rig up so the presence system can drive it. */
  onRigReady: (
    rig: AvatarRig,
    faceRig: FaceRig,
    clips: AnimationClip[],
    metadata: RigMetadata,
  ) => void;
}

/**
 * Renders a Ready Player Me avatar. It takes the model already fetched by the
 * office mount (which owns the Suspense boundary), produces a skeleton-safe
 * clone via the RpmAvatarLoader, and binds the existing adapters to that clone
 * — the object actually on screen — so rig, face, and animation all drive the
 * rendered instance. Shadows and any animation clips are preserved through the
 * unchanged presence/animation pipeline; this component only handles rendering.
 */
export function RpmAvatar({ loaded, onRigReady }: RpmAvatarProps) {
  // Clone once per source. Each mount gets its own bound skeleton.
  const instance = useMemo(() => rpmAvatarLoader.instantiate(loaded), [loaded]);

  useEffect(() => {
    // Bind adapters to the CLONE, not the cached source, so the presence
    // system poses the mesh that's actually rendered.
    const { rig, metadata } = RigAdapter.adapt({
      scene: instance.scene,
      animations: instance.animations,
    });
    onRigReady(rig, ExpressionAdapter.forModel(instance.scene), instance.animations, metadata);

    avatarStatus.reportModel({
      loaded: true,
      skeletonFound: instance.hasSkeleton,
      morphTargetsFound: instance.morphTargetCount > 0,
      animationClips: instance.animations.length,
    });
  }, [instance, onRigReady]);

  return <primitive object={instance.scene} />;
}
