"use client";

import { useEffect, useRef } from "react";
import type { AnimationClip } from "three";

import { ExpressionAdapter, RigAdapter } from "../../adapters";
import type { FaceRig } from "../../face";
import type { AvatarRig, LoadedAvatar, RigMetadata } from "../../types";
import { ProceduralAvatar, type ProceduralAvatarHandle } from "../ProceduralAvatar";

export interface AvatarModelProps {
  /** Parsed GLB/GLTF, or null to render the procedural fallback. */
  loaded: LoadedAvatar | null;
  /** Called once the rig is mountable, with its face rig, clips and metadata. */
  onRigReady: (
    rig: AvatarRig,
    faceRig: FaceRig,
    clips: AnimationClip[],
    metadata: RigMetadata,
  ) => void;
}

/**
 * Renders the avatar body — the real .glb model when one loaded, else the
 * procedural fallback — and reports its rig + face rig + metadata upward so
 * the presence system can drive them. All vendor knowledge lives in the
 * adapters: the RigAdapter normalizes the skeleton, the ExpressionAdapter
 * picks the face implementation. A missing model is not an error; the
 * fallback renders, and a GLB with no blend shapes still animates via
 * body/head motion.
 */
export function AvatarModel({ loaded, onRigReady }: AvatarModelProps) {
  const proceduralRef = useRef<ProceduralAvatarHandle>(null);

  useEffect(() => {
    if (!loaded) return;
    const { rig, metadata } = RigAdapter.adapt(loaded);
    onRigReady(rig, ExpressionAdapter.forModel(loaded.scene), loaded.animations, metadata);
  }, [loaded, onRigReady]);

  useEffect(() => {
    if (loaded || !proceduralRef.current) return;
    const { rig, faceParts } = proceduralRef.current;
    onRigReady(rig, ExpressionAdapter.forProcedural(faceParts), [], RigAdapter.proceduralMetadata());
  }, [loaded, onRigReady]);

  if (loaded) return <primitive object={loaded.scene} />;
  return <ProceduralAvatar ref={proceduralRef} />;
}
