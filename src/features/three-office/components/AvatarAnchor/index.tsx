"use client";

import { useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import type { Group } from "three";

import { STATE_VISUAL, useAvatar } from "@/features/digital-twin";

import { AVATAR_ANCHOR_POSITION } from "../../constants";
import { UNIT_CYLINDER, UNIT_SPHERE, standardMaterial } from "../meshes/resources";

export interface AvatarAnchorProps {
  /** Fires on click so the camera can glide to CameraZone.Avatar. */
  onSelect?: () => void;
}

/**
 * Reserved mount point for the future 3D avatar. No model yet — just the
 * location plus a live link to the AvatarManager: the marker breathes and its
 * state ring recolours with the runtime, proving the integration a Ready
 * Player Me / MetaHuman body will later consume unchanged. Clickable so the
 * AVATAR camera zone has a real trigger, matching every other office object.
 */
export function AvatarAnchor({ onSelect }: AvatarAnchorProps) {
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

  const handleOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
  }, []);

  const handleOut = useCallback(() => {
    document.body.style.cursor = "";
  }, []);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      onSelect?.();
    },
    [onSelect],
  );

  return (
    <group
      ref={groupRef}
      position={AVATAR_ANCHOR_POSITION}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onClick={handleClick}
    >
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
