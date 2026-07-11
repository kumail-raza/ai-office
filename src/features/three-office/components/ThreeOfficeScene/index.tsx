"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { useOfficeInteraction } from "@/features/office";

import { CAMERA_CONFIG, DEFAULT_CAMERA_POSE, OBJECT_CAMERA_ZONE, OBJECT_TRANSFORMS } from "../../constants";
import { assetPreloader } from "../../loaders/AssetPreloader";
import { type CameraView, CameraZone, type ThreeOfficeNode } from "../../types";
import { CameraRig } from "../CameraRig";
import { OfficeEnvironment } from "../OfficeEnvironment";
import { SceneLighting } from "../SceneLighting";

/**
 * The 3D office. Composes the environment (which reads the
 * OfficeObjectRegistry — the single source of truth) and proxies hover/select
 * through the existing office interaction context, so experiences, analytics,
 * and the conversation layer behave identically to the 2D office. Rendered
 * lazily — this module and the three.js stack load only when the 3D view opens.
 */
export default function ThreeOfficeScene() {
  const { hoveredId, selectedObject, setHovered, selectObject, closePanel } = useOfficeInteraction();
  const [avatarFocused, setAvatarFocused] = useState(false);

  // Belt and braces: the loader flow preloads assets, but entering 3D directly
  // (e.g. after a hot reload) must also work. preloadAll() is idempotent.
  useEffect(() => {
    void assetPreloader.preloadAll();
  }, []);

  const handleSelect = useCallback(
    (node: ThreeOfficeNode) => {
      setAvatarFocused(false);
      selectObject(node.object);
    },
    [selectObject],
  );

  const handleSelectAvatar = useCallback(() => {
    closePanel();
    setAvatarFocused(true);
  }, [closePanel]);

  const handlePointerMissed = useCallback(() => {
    setHovered(null);
    setAvatarFocused(false);
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

  // Avatar click → AVATAR zone; else selected object → its camera zone when
  // one is defined, else a generic focus on its position; nothing selected →
  // the Entry overview.
  const view = useMemo<CameraView>(() => {
    if (avatarFocused) return { kind: "zone", zone: CameraZone.Avatar };
    if (!selectedObject) return { kind: "zone", zone: CameraZone.Entry };

    const zone = OBJECT_CAMERA_ZONE[selectedObject.id];
    if (zone) return { kind: "zone", zone };

    const position = OBJECT_TRANSFORMS[selectedObject.id]?.position;
    return position ? { kind: "focus", position } : { kind: "zone", zone: CameraZone.Entry };
  }, [avatarFocused, selectedObject]);

  return (
    <Canvas
      shadows
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
    </Canvas>
  );
}
