"use client";

import { Suspense, useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import type { AnimationClip } from "three";

import type { FaceRig } from "../../face";
import { PresenceSystem } from "../../presence";
import { AvatarRegistry } from "../../services/AvatarRegistry";
import { AvatarRuntimeAdapter } from "../../services/AvatarRuntimeAdapter";
import { avatarEvents } from "../../services/avatarEvents";
import { useAvatarModel } from "../../hooks/useAvatarModel";
import type { AvatarPlacement, AvatarRig } from "../../types";
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

  const presenceRef = useRef<PresenceSystem | null>(null);

  const handleRigReady = useCallback(
    (rig: AvatarRig, faceRig: FaceRig, clips: AnimationClip[]) => {
      presenceRef.current?.dispose();
      presenceRef.current = new PresenceSystem(rig, faceRig, clips);
    },
    [],
  );

  useEffect(() => {
    return () => {
      presenceRef.current?.dispose();
      presenceRef.current = null;
    };
  }, []);

  useFrame((_, deltaSec) => {
    const presence = presenceRef.current;
    if (!presence || !adapterRef.current) return;
    presence.update(adapterRef.current.sample(deltaSec));
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
