"use client";

import { memo } from "react";

import { AREA_DECOR } from "../../constants";
import { OfficeArea, type OfficeMeshTransform, type ThreeOfficeNode } from "../../types";
import { OfficeModel } from "../../models/OfficeModel";
import { AvatarAnchor } from "../AvatarAnchor";
import { InteractiveNode } from "../InteractiveNode";

export interface AreaInteraction {
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (node: ThreeOfficeNode) => void;
}

export interface AreaProps {
  nodes: ThreeOfficeNode[];
  interaction: AreaInteraction;
}

/** Static (non-interactive) set dressing for one area. */
const Decor = memo(function Decor({ transforms }: { transforms: OfficeMeshTransform[] }) {
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

function AreaNodes({ nodes, interaction }: AreaProps) {
  return (
    <>
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
    </>
  );
}

/** Desk, chair, monitor, and coffee — the working heart of the room. */
export function DeskArea(props: AreaProps) {
  return (
    <group>
      <Decor transforms={AREA_DECOR[OfficeArea.Desk]} />
      <AreaNodes {...props} />
    </group>
  );
}

/** The bookshelf along the left wall. */
export function BookshelfArea(props: AreaProps) {
  return (
    <group>
      <Decor transforms={AREA_DECOR[OfficeArea.Bookshelf]} />
      <AreaNodes {...props} />
    </group>
  );
}

/** The window on the back wall. */
export function WindowArea(props: AreaProps) {
  return (
    <group>
      <Decor transforms={AREA_DECOR[OfficeArea.Window]} />
      <AreaNodes {...props} />
    </group>
  );
}

/** Plants, the certificate, and other ambient dressing. */
export function DecorationArea(props: AreaProps) {
  return (
    <group>
      <Decor transforms={AREA_DECOR[OfficeArea.Decoration]} />
      <AreaNodes {...props} />
    </group>
  );
}

/** Placeholder region reserved for the digital twin's future 3D body. */
export function AvatarArea() {
  return <AvatarAnchor />;
}
