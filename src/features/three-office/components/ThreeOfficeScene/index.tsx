"use client";

import { useCallback, useMemo } from "react";
import { Canvas } from "@react-three/fiber";

import { OfficeObjectRegistry, useOfficeInteraction } from "@/features/office";

import { CAMERA_CONFIG, DECOR_TRANSFORMS, DEFAULT_CAMERA_POSE, OBJECT_TRANSFORMS } from "../../constants";
import type { ScenePosition, ThreeOfficeNode } from "../../types";
import { AvatarAnchor } from "../AvatarAnchor";
import { CameraRig } from "../CameraRig";
import { InteractiveNode } from "../InteractiveNode";
import { MESH_BY_KIND } from "../meshes";
import { RoomShell } from "../RoomShell";
import { SceneLighting } from "../SceneLighting";

/**
 * The 3D office. Reads interactive objects from the OfficeObjectRegistry (the
 * single source of truth) and proxies hover/select through the existing office
 * interaction context, so experiences, analytics, and the conversation layer
 * behave identically to the 2D office. Rendered lazily — this module and the
 * three.js stack load only when the 3D view is opened.
 */
export default function ThreeOfficeScene() {
  const { hoveredId, selectedObject, setHovered, selectObject } = useOfficeInteraction();

  const nodes = useMemo<ThreeOfficeNode[]>(
    () =>
      OfficeObjectRegistry.getAll().flatMap((object) => {
        const transform = OBJECT_TRANSFORMS[object.id];
        return transform ? [{ object, transform }] : [];
      }),
    [],
  );

  const handleSelect = useCallback(
    (node: ThreeOfficeNode) => selectObject(node.object),
    [selectObject],
  );

  const focusPosition = useMemo<ScenePosition | null>(() => {
    if (!selectedObject) return null;
    return OBJECT_TRANSFORMS[selectedObject.id]?.position ?? null;
  }, [selectedObject]);

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
      onPointerMissed={() => setHovered(null)}
    >
      <SceneLighting />
      <CameraRig focusPosition={focusPosition} />
      <RoomShell />

      {DECOR_TRANSFORMS.map((transform, index) => {
        const Mesh = MESH_BY_KIND[transform.kind];
        return (
          <group
            key={`${transform.kind}-${index}`}
            position={transform.position}
            rotation={[0, transform.rotationY ?? 0, 0]}
          >
            <Mesh />
          </group>
        );
      })}

      {nodes.map((node) => (
        <InteractiveNode
          key={node.object.id}
          node={node}
          hovered={hoveredId === node.object.id}
          selected={selectedObject?.id === node.object.id}
          onHover={setHovered}
          onSelect={handleSelect}
        />
      ))}

      <AvatarAnchor />
    </Canvas>
  );
}
