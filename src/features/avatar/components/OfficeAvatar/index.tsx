"use client";

import { Suspense, useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import type { AnimationClip } from "three";

import { FocusTargetName } from "../../adapters";
import type { FaceRig } from "../../face";
import { PresenceSystem } from "../../presence";
import { AvatarRuntimeAdapter } from "../../services/AvatarRuntimeAdapter";
import { avatarEvents } from "../../services/avatarEvents";
import { useActiveAvatarModel } from "../../hooks/useAvatarModel";
import type { AvatarPlacement, AvatarRig, RigMetadata, ScenePosition } from "../../types";
import { AvatarErrorBoundary } from "../AvatarErrorBoundary";
import { AvatarModel } from "../AvatarModel";

/** A named world position the avatar can attend to (monitor, window, ...). */
export interface AvatarFocusTarget {
  name: string;
  position: ScenePosition;
}

export interface OfficeAvatarProps {
  /** World placement — supplied by the room, never hardcoded in the avatar. */
  placement: AvatarPlacement;
  /** World positions to register as eye-focus targets. The room knows where
   * its objects are; the avatar only understands normalized gaze. */
  focusTargets?: AvatarFocusTarget[];
  /** Fires on click so the camera can focus the avatar. */
  onSelect?: () => void;
}

interface OfficeAvatarBodyProps {
  placement: AvatarPlacement;
  focusTargets?: AvatarFocusTarget[];
  onSelect?: () => void;
}

/**
 * The office's avatar body, wired to the Digital Twin Runtime. Loads the
 * active model through the registry's fallback chain (active → fallback GLB →
 * procedural), then each frame samples the runtime through the read-only
 * adapter and drives the rig via the presence system. Hover/click route
 * through the shared avatar event bus and the room's focus callback.
 */
function OfficeAvatarBody({ placement, focusTargets, onSelect }: OfficeAvatarBodyProps) {
  const { loaded, source } = useActiveAvatarModel();

  const adapterRef = useRef<AvatarRuntimeAdapter | null>(null);
  if (adapterRef.current === null) adapterRef.current = new AvatarRuntimeAdapter();

  const presenceRef = useRef<PresenceSystem | null>(null);

  const handleRigReady = useCallback(
    (rig: AvatarRig, faceRig: FaceRig, clips: AnimationClip[], metadata: RigMetadata) => {
      presenceRef.current?.dispose();
      const presence = new PresenceSystem(rig, faceRig, clips, {
        metadata,
        source: source ?? undefined,
      });

      // Eye-target registration: the avatar faces the visitor at rest, so
      // "visitor" is straight ahead; room objects arrive as world positions.
      const eyes = presence.getEyeTargets();
      eyes.configure(placement);
      eyes.registerDirection(FocusTargetName.Visitor, { x: 0, y: 0 });
      focusTargets?.forEach((target) => eyes.registerWorldTarget(target.name, target.position));

      presenceRef.current = presence;
    },
    [source, placement, focusTargets],
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
      <AvatarErrorBoundary fallback={<AvatarModel loaded={null} onRigReady={handleRigReady} />}>
        <AvatarModel loaded={loaded} onRigReady={handleRigReady} />
      </AvatarErrorBoundary>
    </group>
  );
}

export function OfficeAvatar({ placement, focusTargets, onSelect }: OfficeAvatarProps) {
  return (
    <group
      position={placement.position}
      rotation={[0, placement.rotationY, 0]}
      scale={placement.scale}
    >
      <Suspense fallback={null}>
        <OfficeAvatarBody placement={placement} focusTargets={focusTargets} onSelect={onSelect} />
      </Suspense>
    </group>
  );
}
