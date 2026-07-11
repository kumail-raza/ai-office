"use client";

import { memo, useCallback } from "react";
import type { ThreeEvent } from "@react-three/fiber";

import type { ThreeOfficeNode } from "../../types";
import { MESH_BY_KIND } from "../meshes";
import { UNIT_CYLINDER, standardMaterial } from "../meshes/resources";

export interface InteractiveNodeProps {
  node: ThreeOfficeNode;
  hovered: boolean;
  selected: boolean;
  onHover: (id: string | null) => void;
  onSelect: (node: ThreeOfficeNode) => void;
}

const highlight = standardMaterial("#f4b400", {
  roughness: 0.4,
  emissive: "#f4b400",
  emissiveIntensity: 0.8,
});

/**
 * An interactive registry object in the 3D room. Hover / click resolve through
 * R3F's raycaster; the handlers proxy straight into the shared office
 * interaction context so the 2D layer, experiences, and analytics all behave
 * exactly as they do for the 2D hotspots.
 */
export const InteractiveNode = memo(function InteractiveNode({
  node,
  hovered,
  selected,
  onHover,
  onSelect,
}: InteractiveNodeProps) {
  const Mesh = MESH_BY_KIND[node.transform.kind];

  const handleOver = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      onHover(node.object.id);
      document.body.style.cursor = "pointer";
    },
    [node.object.id, onHover],
  );

  const handleOut = useCallback(() => {
    onHover(null);
    document.body.style.cursor = "";
  }, [onHover]);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      onSelect(node);
    },
    [node, onSelect],
  );

  return (
    <group
      position={node.transform.position}
      rotation={[0, node.transform.rotationY ?? 0, 0]}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onClick={handleClick}
    >
      <Mesh />
      {hovered || selected ? (
        <mesh
          geometry={UNIT_CYLINDER}
          material={highlight}
          position={[0, 0.012, 0]}
          scale={[0.9, 0.018, 0.9]}
        />
      ) : null}
    </group>
  );
});
