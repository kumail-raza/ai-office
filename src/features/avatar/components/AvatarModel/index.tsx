"use client";

import { useEffect, useRef } from "react";
import type { AnimationClip } from "three";

import { ExpressionAdapter, RigAdapter } from "../../adapters";
import type { FaceRig } from "../../face";
import { avatarStatus } from "../../presence/avatarStatus";
import type { AvatarRig, LoadedAvatar, RigMetadata } from "../../types";
import { ProceduralAvatar, type ProceduralAvatarHandle } from "../ProceduralAvatar";
import { RpmAvatar } from "../RpmAvatar";

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
 * The avatar's render router — the single decision between a loaded model and
 * the procedural placeholder, inside the office's one mount point. A real .glb
 * renders through <RpmAvatar/> (skeleton-safe clone, shadows, animations); a
 * missing/broken model falls back to the procedural figure. Either way, vendor
 * knowledge stays in the adapters and the rig is reported upward unchanged — so
 * the presence system, AvatarManager, and adapters are untouched by the swap.
 */
export function AvatarModel({ loaded, onRigReady }: AvatarModelProps) {
  const proceduralRef = useRef<ProceduralAvatarHandle>(null);

  useEffect(() => {
    if (loaded || !proceduralRef.current) return;
    const { rig, faceParts } = proceduralRef.current;
    onRigReady(rig, ExpressionAdapter.forProcedural(faceParts), [], RigAdapter.proceduralMetadata());
    avatarStatus.reportModel({
      loaded: false,
      skeletonFound: false,
      morphTargetsFound: false,
      animationClips: 0,
    });
  }, [loaded, onRigReady]);

  if (loaded) return <RpmAvatar loaded={loaded} onRigReady={onRigReady} />;
  return <ProceduralAvatar ref={proceduralRef} />;
}
