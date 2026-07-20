"use client";

import { memo } from "react";

import { OfficeAvatar } from "@/features/avatar";

import { AVATAR_PLACEMENT } from "../../constants";
import type { ZoneConfig } from "../../environment/zones";
import { OfficeArea, type OfficeMeshTransform, type ThreeOfficeNode } from "../../types";
import { OfficeModel } from "../../models/OfficeModel";
import { InteractiveNode } from "../InteractiveNode";

export interface AreaInteraction {
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (node: ThreeOfficeNode) => void;
}

/** Static (non-interactive) set dressing for one zone. */
const ZoneDecor = memo(function ZoneDecor({ transforms }: { transforms: OfficeMeshTransform[] }) {
  return (
    <>
      {transforms.map((transform, index) => (
        <group
          key={`${transform.kind}-${index}`}
          position={transform.position}
          rotation={[0, transform.rotationY ?? 0, 0]}
        >
          <OfficeModel kind={transform.kind} />
        </group>
      ))}
    </>
  );
});

export interface OfficeZoneProps {
  zone: ZoneConfig;
  nodes: ThreeOfficeNode[];
  interaction: AreaInteraction;
  onSelectAvatar?: () => void;
}

/**
 * Renders one configured zone: its set dressing plus the interactive registry
 * objects assigned to it. The Avatar zone is the one special case — its body is
 * owned by the avatar feature.
 */
export function OfficeZone({ zone, nodes, interaction, onSelectAvatar }: OfficeZoneProps) {
  if (zone.id === OfficeArea.Avatar) {
    return <OfficeAvatar placement={AVATAR_PLACEMENT} onSelect={onSelectAvatar} />;
  }

  return (
    <group>
      <ZoneDecor transforms={zone.decor} />
      {nodes.map((node) => (
        <InteractiveNode
          key={node.object.id}
          node={node}
          hovered={interaction.hoveredId === node.object.id}
          selected={interaction.selectedId === node.object.id}
          onHover={interaction.onHover}
          onSelect={interaction.onSelect}
        />
      ))}
    </group>
  );
}
