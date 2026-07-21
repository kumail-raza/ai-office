"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { AvatarGesture, AvatarState, useAvatar } from "@/features/digital-twin";
import { useOfficeInteraction } from "@/features/office";

import {
  AVATAR_PLACEMENT,
  CAMERA_CONFIG,
  DEFAULT_CAMERA_POSE,
  OBJECT_CAMERA_ZONE,
  OBJECT_TRANSFORMS,
  conversationCamera,
  focusAvatar,
  greetingCamera,
} from "../../constants";
import { InteractionManager } from "../../managers/InteractionManager";
import type { InteractionZone } from "../../interaction/zones";
import { assetPreloader } from "../../loaders/AssetPreloader";
import { type CameraView, CameraZone, type ScenePosition, type ThreeOfficeNode } from "../../types";
import { CameraRig } from "../CameraRig";
import { OfficeEnvironment } from "../OfficeEnvironment";
import { SceneLighting } from "../SceneLighting";
import { ZoneFocusIndicator } from "../ZoneFocusIndicator";

/**
 * The 3D office. Composes the environment (which reads the
 * OfficeObjectRegistry — the single source of truth) and proxies hover/select
 * through the existing office interaction context, so experiences, analytics,
 * and the conversation layer behave identically to the 2D office. Rendered
 * lazily — this module and the three.js stack load only when the 3D view opens.
 */
export default function ThreeOfficeScene() {
  const { hoveredId, selectedObject, setHovered, selectObject, closePanel } = useOfficeInteraction();
  const { currentState, currentGesture } = useAvatar();
  const [avatarClicked, setAvatarClicked] = useState(false);

  // Focus system: turns the current selection into the active interaction zone,
  // firing zone/interaction events (→ analytics + the context bridge). The
  // instance is created once and lives for the scene's lifetime.
  const interactionRef = useRef<InteractionManager | null>(null);
  if (interactionRef.current === null) interactionRef.current = new InteractionManager();
  const [activeZone, setActiveZone] = useState<InteractionZone | null>(null);

  // "Entering a conversation" = the runtime is in an active turn; the camera
  // pulls to the conversation frame so the visitor watches the avatar react.
  const conversationActive =
    currentState === AvatarState.Listening ||
    currentState === AvatarState.Thinking ||
    currentState === AvatarState.Speaking;

  // A wave/greeting beat gets its own closer, frontal framing.
  const greetingActive =
    currentGesture === AvatarGesture.Greeting || currentGesture === AvatarGesture.Wave;

  // Belt and braces: the loader flow preloads assets, but entering 3D directly
  // (e.g. after a hot reload) must also work. preloadAll() is idempotent.
  useEffect(() => {
    void assetPreloader.preloadAll();
  }, []);

  const handleSelect = useCallback(
    (node: ThreeOfficeNode) => {
      setAvatarClicked(false);
      selectObject(node.object);
    },
    [selectObject],
  );

  const handleSelectAvatar = useCallback(() => {
    closePanel();
    setAvatarClicked(true);
  }, [closePanel]);

  const handlePointerMissed = useCallback(() => {
    setHovered(null);
    setAvatarClicked(false);
  }, [setHovered]);

  const interaction = useMemo(
    () => ({
      hoveredId,
      selectedId: selectedObject?.id ?? null,
      onHover: setHovered,
      onSelect: handleSelect,
    }),
    [hoveredId, selectedObject, setHovered, handleSelect],
  );

  // Feed the current selection to the focus system as a world-space probe
  // point: the avatar's placement when it's focused, else the selected object's
  // transform, else nothing. The manager resolves the active zone (firing
  // enter/leave + analytics) and triggers its bridged experience once.
  useEffect(() => {
    const manager = interactionRef.current;
    if (!manager) return;

    let probe: ScenePosition | null = null;
    if (avatarClicked) probe = AVATAR_PLACEMENT.position;
    else if (selectedObject) probe = OBJECT_TRANSFORMS[selectedObject.id]?.position ?? null;

    manager.setProbePoint(probe);
    manager.triggerActive();
    setActiveZone(manager.getActiveZone());
  }, [avatarClicked, selectedObject]);

  // Avatar framings first — greeting beats conversation beats a plain click —
  // then selected object → its camera zone when one is defined, else a generic
  // focus on its position; nothing selected → the Entry overview.
  const view = useMemo<CameraView>(() => {
    if (greetingActive) return { kind: "pose", pose: greetingCamera() };
    if (conversationActive) return { kind: "pose", pose: conversationCamera() };
    if (avatarClicked) return { kind: "pose", pose: focusAvatar() };
    if (!selectedObject) return { kind: "zone", zone: CameraZone.Entry };

    const zone = OBJECT_CAMERA_ZONE[selectedObject.id];
    if (zone) return { kind: "zone", zone };

    const position = OBJECT_TRANSFORMS[selectedObject.id]?.position;
    return position ? { kind: "focus", position } : { kind: "zone", zone: CameraZone.Entry };
  }, [greetingActive, conversationActive, avatarClicked, selectedObject]);

  return (
    <Canvas
      // "percentage" = PCFShadowMap; the default (true → PCFSoftShadowMap) is
      // deprecated in three r0.185 and logs a console warning.
      shadows="percentage"
      dpr={[1, 2]}
      camera={{
        fov: CAMERA_CONFIG.fov,
        near: CAMERA_CONFIG.near,
        far: CAMERA_CONFIG.far,
        position: DEFAULT_CAMERA_POSE.position,
      }}
      // Pointer misses clear hover state so the 2D layer stays in sync.
      onPointerMissed={handlePointerMissed}
    >
      <SceneLighting />
      <CameraRig view={view} />
      <OfficeEnvironment interaction={interaction} onSelectAvatar={handleSelectAvatar} />
      <ZoneFocusIndicator position={activeZone?.position ?? null} />
    </Canvas>
  );
}
