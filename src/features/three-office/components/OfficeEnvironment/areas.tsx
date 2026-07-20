"use client";

import { memo } from "react";

import { type AvatarFocusTarget, FocusTargetName, OfficeAvatar } from "@/features/avatar";

import { AVATAR_PLACEMENT, OBJECT_TRANSFORMS } from "../../constants";
import type { ZoneConfig } from "../../environment/zones";
import { OfficeArea, type OfficeMeshTransform, type ThreeOfficeNode } from "../../types";
import { OfficeModel } from "../../models/OfficeModel";
import { InteractiveNode } from "../InteractiveNode";

/**
 * World positions the avatar's eyes can attend to. Room knowledge stays here —
 * the avatar feature only ever sees named positions, never object ids.
 */
const AVATAR_FOCUS_TARGETS: AvatarFocusTarget[] = [
  { name: FocusTargetName.Monitor, position: OBJECT_TRANSFORMS.monitor.position },
  { name: FocusTargetName.Window, position: OBJECT_TRANSFORMS.window.position },
];

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
    return (
      <OfficeAvatar
        placement={AVATAR_PLACEMENT}
        focusTargets={AVATAR_FOCUS_TARGETS}
        onSelect={onSelectAvatar}
      />
    );
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
