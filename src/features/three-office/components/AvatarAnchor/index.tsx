"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

import { STATE_VISUAL, useAvatar } from "@/features/digital-twin";

import { AVATAR_ANCHOR_POSITION } from "../../constants";
import { UNIT_CYLINDER, UNIT_SPHERE, standardMaterial } from "../meshes/resources";

/**
 * Reserved mount point for the future 3D avatar. No model yet — just the
 * location plus a live link to the AvatarManager: the marker breathes and its
 * state ring recolours with the runtime, proving the integration a Ready
 * Player Me / MetaHuman body will later consume unchanged.
 */
export function AvatarAnchor() {
  const { currentState } = useAvatar();
  const groupRef = useRef<Group>(null);

  const visual = STATE_VISUAL[currentState];

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    // Subtle breathing so the anchor reads as "alive" without a model.
    const s = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.015;
    group.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef} position={AVATAR_ANCHOR_POSITION}>
      <mesh
        geometry={UNIT_SPHERE}
        material={standardMaterial("#dbe4f0", { roughness: 0.35 })}
        position={[0, 0.62, 0]}
        scale={[0.34, 0.34, 0.34]}
        castShadow
      />
      <mesh
        geometry={UNIT_CYLINDER}
        material={standardMaterial("#b9c6d8", { roughness: 0.5 })}
        position={[0, 0.18, 0]}
        scale={[0.4, 0.52, 0.34]}
        castShadow
      />
      <mesh
        geometry={UNIT_CYLINDER}
        material={standardMaterial(visual.accent, {
          roughness: 0.4,
          emissive: visual.accent,
          emissiveIntensity: 0.9,
        })}
        position={[0, -0.5, 0]}
        scale={[1, 0.02, 1]}
      />
    </group>
  );
}
