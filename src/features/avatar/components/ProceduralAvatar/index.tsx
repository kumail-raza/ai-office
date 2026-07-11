"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import type { Group } from "three";

import { useAvatar } from "@/features/digital-twin";
import { STATE_VISUAL } from "@/features/digital-twin";

import type { AvatarRig } from "../../types";
import {
  BOX_GEOMETRY,
  CAPSULE_GEOMETRY,
  CYLINDER_GEOMETRY,
  HEAD_GEOMETRY,
  avatarMaterial,
} from "../resources";

const skin = avatarMaterial("#f0c3a1");
const hair = avatarMaterial("#33261c");
const shirt = avatarMaterial("#3e5c76");
const trouser = avatarMaterial("#2f3a45");
const shoe = avatarMaterial("#20262d");

/**
 * Stylized humanoid built from primitives — the graceful fallback the office
 * shows until a real .glb avatar ships. Exposes an AvatarRig (root + head +
 * right arm, by ref) so the ProceduralAnimator can drive posture, head, and
 * waves. A soft ground disc tints with the runtime state for readable feedback.
 */
export const ProceduralAvatar = forwardRef<AvatarRig>(function ProceduralAvatar(_props, ref) {
  const rootRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const armRightRef = useRef<Group>(null);

  const { currentState } = useAvatar();
  const accent = STATE_VISUAL[currentState].accent;

  useImperativeHandle(
    ref,
    (): AvatarRig => ({
      root: rootRef.current as Group,
      head: headRef.current,
      armRight: armRightRef.current,
    }),
    [],
  );

  return (
    <group ref={rootRef}>
      {/* Ground disc — subtle state-coloured presence marker. */}
      <mesh
        geometry={CYLINDER_GEOMETRY}
        material={avatarMaterial(accent, { emissive: accent, emissiveIntensity: 0.6, roughness: 0.5 })}
        position={[0, 0.012, 0]}
        scale={[0.9, 0.02, 0.9]}
      />

      {/* Legs + feet */}
      <mesh geometry={CAPSULE_GEOMETRY} material={trouser} position={[-0.17, 0.5, 0]} scale={[0.16, 0.46, 0.16]} castShadow />
      <mesh geometry={CAPSULE_GEOMETRY} material={trouser} position={[0.17, 0.5, 0]} scale={[0.16, 0.46, 0.16]} castShadow />
      <mesh geometry={BOX_GEOMETRY} material={shoe} position={[-0.17, 0.06, 0.08]} scale={[0.2, 0.1, 0.34]} castShadow />
      <mesh geometry={BOX_GEOMETRY} material={shoe} position={[0.17, 0.06, 0.08]} scale={[0.2, 0.1, 0.34]} castShadow />

      {/* Torso */}
      <mesh geometry={CAPSULE_GEOMETRY} material={shirt} position={[0, 1.16, 0]} scale={[0.34, 0.42, 0.24]} castShadow />

      {/* Left arm (static) */}
      <group position={[-0.36, 1.42, 0]} rotation={[0, 0, 0.05]}>
        <mesh geometry={CAPSULE_GEOMETRY} material={shirt} position={[0, -0.28, 0]} scale={[0.11, 0.34, 0.11]} castShadow />
      </group>

      {/* Right arm (animated: pivots at the shoulder for waves) */}
      <group ref={armRightRef} position={[0.36, 1.42, 0]} rotation={[0, 0, 0.05]}>
        <mesh geometry={CAPSULE_GEOMETRY} material={shirt} position={[0, -0.28, 0]} scale={[0.11, 0.34, 0.11]} castShadow />
      </group>

      {/* Head (animated: yaw/pitch/tilt) */}
      <group ref={headRef} position={[0, 1.72, 0]}>
        <mesh geometry={HEAD_GEOMETRY} material={skin} scale={[0.3, 0.34, 0.3]} castShadow />
        <mesh geometry={HEAD_GEOMETRY} material={hair} position={[0, 0.08, -0.02]} scale={[0.32, 0.28, 0.32]} castShadow />
      </group>
    </group>
  );
});
