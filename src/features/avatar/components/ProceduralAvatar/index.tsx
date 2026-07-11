"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import type { Group, Mesh } from "three";

import type { ProceduralFaceParts } from "../../face";
import type { AvatarRig } from "../../types";
import { BOX_GEOMETRY, CAPSULE_GEOMETRY, HEAD_GEOMETRY, avatarMaterial } from "../resources";

const skin = avatarMaterial("#f0c3a1");
const hair = avatarMaterial("#33261c");
const shirt = avatarMaterial("#3e5c76");
const trouser = avatarMaterial("#2f3a45");
const shoe = avatarMaterial("#20262d");
const white = avatarMaterial("#ffffff", { roughness: 0.4 });
const dark = avatarMaterial("#2a2320");
const mouthColor = avatarMaterial("#7a3f30");

/** Exposed handle: the body rig plus the animatable face parts. */
export interface ProceduralAvatarHandle {
  rig: AvatarRig;
  faceParts: ProceduralFaceParts;
}

/**
 * Stylized humanoid built from primitives — the graceful fallback the office
 * shows until a real .glb avatar ships. Now with an animatable face (eyes,
 * pupils, eyelids, brows, mouth) so the presence system can blink, gaze, and
 * express. Exposes the body rig + face parts by ref.
 */
export const ProceduralAvatar = forwardRef<ProceduralAvatarHandle>(function ProceduralAvatar(
  _props,
  ref,
) {
  const rootRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const armRightRef = useRef<Group>(null);

  const pupilLeftRef = useRef<Mesh>(null);
  const pupilRightRef = useRef<Mesh>(null);
  const lidLeftRef = useRef<Group>(null);
  const lidRightRef = useRef<Group>(null);
  const browLeftRef = useRef<Mesh>(null);
  const browRightRef = useRef<Mesh>(null);
  const mouthRef = useRef<Mesh>(null);

  useImperativeHandle(
    ref,
    (): ProceduralAvatarHandle => ({
      rig: {
        root: rootRef.current as Group,
        head: headRef.current,
        armRight: armRightRef.current,
      },
      faceParts: {
        pupilLeft: pupilLeftRef.current as Mesh,
        pupilRight: pupilRightRef.current as Mesh,
        lidLeft: lidLeftRef.current as Group,
        lidRight: lidRightRef.current as Group,
        browLeft: browLeftRef.current as Mesh,
        browRight: browRightRef.current as Mesh,
        mouth: mouthRef.current as Mesh,
      },
    }),
    [],
  );

  return (
    <group ref={rootRef}>
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

      {/* Head (animated: yaw/pitch/tilt) + face */}
      <group ref={headRef} position={[0, 1.72, 0]}>
        <mesh geometry={HEAD_GEOMETRY} material={skin} scale={[0.3, 0.34, 0.3]} castShadow />
        <mesh geometry={HEAD_GEOMETRY} material={hair} position={[0, 0.08, -0.02]} scale={[0.32, 0.28, 0.32]} castShadow />

        {/* Eyes: white + pupil (pupils shift with gaze) */}
        <mesh geometry={HEAD_GEOMETRY} material={white} position={[-0.06, 0.04, 0.12]} scale={[0.035, 0.045, 0.02]} />
        <mesh geometry={HEAD_GEOMETRY} material={white} position={[0.06, 0.04, 0.12]} scale={[0.035, 0.045, 0.02]} />
        <mesh ref={pupilLeftRef} geometry={HEAD_GEOMETRY} material={dark} position={[-0.06, 0.04, 0.14]} scale={[0.018, 0.018, 0.012]} />
        <mesh ref={pupilRightRef} geometry={HEAD_GEOMETRY} material={dark} position={[0.06, 0.04, 0.14]} scale={[0.018, 0.018, 0.012]} />

        {/* Eyelids: groups scaled 0→1 on the Y to blink */}
        <group ref={lidLeftRef} position={[-0.06, 0.04, 0.142]} scale={[1, 0, 1]}>
          <mesh geometry={BOX_GEOMETRY} material={skin} scale={[0.05, 0.05, 0.014]} />
        </group>
        <group ref={lidRightRef} position={[0.06, 0.04, 0.142]} scale={[1, 0, 1]}>
          <mesh geometry={BOX_GEOMETRY} material={skin} scale={[0.05, 0.05, 0.014]} />
        </group>

        {/* Brows */}
        <mesh ref={browLeftRef} geometry={BOX_GEOMETRY} material={dark} position={[-0.06, 0.1, 0.13]} scale={[0.06, 0.012, 0.02]} />
        <mesh ref={browRightRef} geometry={BOX_GEOMETRY} material={dark} position={[0.06, 0.1, 0.13]} scale={[0.06, 0.012, 0.02]} />

        {/* Mouth */}
        <mesh ref={mouthRef} geometry={BOX_GEOMETRY} material={mouthColor} position={[0, -0.07, 0.135]} scale={[0.07, 0.018, 0.02]} />
      </group>
    </group>
  );
});
