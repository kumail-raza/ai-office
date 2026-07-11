"use client";

import { useEffect, useRef } from "react";
import type { AnimationClip, Object3D } from "three";

import type { AvatarRig, LoadedAvatar } from "../../types";
import { ProceduralAvatar } from "../ProceduralAvatar";

export interface AvatarModelProps {
  /** Parsed GLB/GLTF, or null to render the procedural fallback. */
  loaded: LoadedAvatar | null;
  /** Called once the rig is mountable, with any clips the model carries. */
  onRigReady: (rig: AvatarRig, clips: AnimationClip[]) => void;
}

/** Common head/arm node names across Mixamo / Ready Player Me / custom rigs. */
const HEAD_NAMES = ["Head", "head", "mixamorigHead", "Wolf3D_Head"];
const ARM_RIGHT_NAMES = ["ArmRight", "RightArm", "mixamorigRightArm", "RightUpperArm"];

function findNode(root: Object3D, names: string[]): Object3D | null {
  for (const name of names) {
    const node = root.getObjectByName(name);
    if (node) return node;
  }
  return null;
}

/**
 * Renders the avatar body — the real .glb model when one loaded, else the
 * procedural fallback — and reports its rig upward so the animator can drive it.
 * A missing model is not an error here; it simply means the fallback renders.
 */
export function AvatarModel({ loaded, onRigReady }: AvatarModelProps) {
  const proceduralRigRef = useRef<AvatarRig>(null);

  useEffect(() => {
    if (!loaded) return;
    onRigReady(
      {
        root: loaded.scene,
        head: findNode(loaded.scene, HEAD_NAMES),
        armRight: findNode(loaded.scene, ARM_RIGHT_NAMES),
      },
      loaded.animations,
    );
  }, [loaded, onRigReady]);

  useEffect(() => {
    if (loaded || !proceduralRigRef.current) return;
    // The procedural figure carries no clips → ProceduralAnimator.
    onRigReady(proceduralRigRef.current, []);
  }, [loaded, onRigReady]);

  if (loaded) return <primitive object={loaded.scene} />;
  return <ProceduralAvatar ref={proceduralRigRef} />;
}
