"use client";

import { useEffect, useRef } from "react";
import type { AnimationClip, Object3D } from "three";

import { type FaceRig, MorphFaceRig, ProceduralFaceRig } from "../../face";
import type { AvatarRig, LoadedAvatar } from "../../types";
import { ProceduralAvatar, type ProceduralAvatarHandle } from "../ProceduralAvatar";

export interface AvatarModelProps {
  /** Parsed GLB/GLTF, or null to render the procedural fallback. */
  loaded: LoadedAvatar | null;
  /** Called once the rig is mountable, with its face rig and any clips. */
  onRigReady: (rig: AvatarRig, faceRig: FaceRig, clips: AnimationClip[]) => void;
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
 * procedural fallback — and reports its rig + face rig upward so the presence
 * system can drive them. A missing model is not an error; the fallback renders,
 * and a GLB with no blend shapes still animates via body/head motion.
 */
export function AvatarModel({ loaded, onRigReady }: AvatarModelProps) {
  const proceduralRef = useRef<ProceduralAvatarHandle>(null);

  useEffect(() => {
    if (!loaded) return;
    const rig: AvatarRig = {
      root: loaded.scene,
      head: findNode(loaded.scene, HEAD_NAMES),
      armRight: findNode(loaded.scene, ARM_RIGHT_NAMES),
    };
    onRigReady(rig, new MorphFaceRig(loaded.scene), loaded.animations);
  }, [loaded, onRigReady]);

  useEffect(() => {
    if (loaded || !proceduralRef.current) return;
    const { rig, faceParts } = proceduralRef.current;
    onRigReady(rig, new ProceduralFaceRig(faceParts), []);
  }, [loaded, onRigReady]);

  if (loaded) return <primitive object={loaded.scene} />;
  return <ProceduralAvatar ref={proceduralRef} />;
}
