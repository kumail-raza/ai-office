"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

import { MaterialKind, material } from "../../materials";
import type { ScenePosition } from "../../types";
import { UNIT_TORUS } from "../meshes/resources";

export interface ZoneFocusIndicatorProps {
  /** World-space centre of the active zone, or null when no zone is active. */
  position: ScenePosition | null;
}

const ring = material(MaterialKind.Highlight);

/**
 * The active-zone focus ring: a single flat brass torus on the floor beneath
 * the active zone, with a gentle imperative pulse. One mesh, one shared
 * material/geometry, animated by writing the ref in the frame loop (no React
 * re-render) — so it stays cheap regardless of how often the zone changes.
 * Renders nothing when no zone is active.
 */
export function ZoneFocusIndicator({ position }: ZoneFocusIndicatorProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    // Slow breath between ~0.9× and ~1.05× so the ring reads as "alive".
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.2) * 0.075;
    mesh.scale.set(1.1 * pulse, 1.1 * pulse, 1);
  });

  if (!position) return null;

  return (
    <mesh
      ref={meshRef}
      geometry={UNIT_TORUS}
      material={ring}
      position={[position[0], 0.03, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
}
