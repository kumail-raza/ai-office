"use client";

import { Suspense, useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import type { AnimationClip } from "three";

import { AvatarRegistry } from "../../services/AvatarRegistry";
import { AvatarRuntimeAdapter } from "../../services/AvatarRuntimeAdapter";
import { createAnimator } from "../../services/animation/createAnimator";
import { avatarEvents } from "../../services/avatarEvents";
import { useAvatarModel } from "../../hooks/useAvatarModel";
import type { AvatarAnimator, AvatarPlacement, AvatarRig } from "../../types";
import { AvatarModel } from "../AvatarModel";

export interface OfficeAvatarProps {
  /** World placement — supplied by the room, never hardcoded in the avatar. */
  placement: AvatarPlacement;
  /** Fires on click so the camera can focus the avatar. */
  onSelect?: () => void;
}

/**
 * The office's avatar body, wired to the Digital Twin Runtime. Loads the active
 * model (suspending only if a real asset ships), then each frame samples the
 * runtime through the read-only adapter and drives the rig with the animator
 * chosen for that model. Hover/click route through the shared avatar event bus
 * and the room's focus callback.
 */
function OfficeAvatarBody({ onSelect }: { onSelect?: () => void }) {
  const loaded = useAvatarModel(AvatarRegistry.getActive());

  const adapterRef = useRef<AvatarRuntimeAdapter | null>(null);
  if (adapterRef.current === null) adapterRef.current = new AvatarRuntimeAdapter();

  const rigRef = useRef<AvatarRig | null>(null);
  const animatorRef = useRef<AvatarAnimator | null>(null);

  const handleRigReady = useCallback((rig: AvatarRig, clips: AnimationClip[]) => {
    rigRef.current = rig;
    animatorRef.current?.dispose();
    animatorRef.current = createAnimator(rig, clips);
  }, []);

  useEffect(() => {
    return () => {
      animatorRef.current?.dispose();
      animatorRef.current = null;
    };
  }, []);

  useFrame((_, deltaSec) => {
    const rig = rigRef.current;
    const animator = animatorRef.current;
    if (!rig || !animator || !adapterRef.current) return;
    animator.update(rig, adapterRef.current.sample(deltaSec));
  });

  const handleOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
    avatarEvents.emit("avatar-hovered", { hovered: true });
  }, []);

  const handleOut = useCallback(() => {
    document.body.style.cursor = "";
    avatarEvents.emit("avatar-hovered", { hovered: false });
  }, []);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      avatarEvents.emit("avatar-clicked", {});
      onSelect?.();
    },
    [onSelect],
  );

  return (
    <group onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
      <AvatarModel loaded={loaded} onRigReady={handleRigReady} />
    </group>
  );
}

export function OfficeAvatar({ placement, onSelect }: OfficeAvatarProps) {
  return (
    <group
      position={placement.position}
      rotation={[0, placement.rotationY, 0]}
      scale={placement.scale}
    >
      <Suspense fallback={null}>
        <OfficeAvatarBody onSelect={onSelect} />
      </Suspense>
    </group>
  );
}
