"use client";

import { useMemo } from "react";

import { OfficeObjectRegistry } from "@/features/office";

import { AREA_OBJECT_IDS, OBJECT_TRANSFORMS } from "../../constants";
import { OfficeArea, type ThreeOfficeNode } from "../../types";
import { RoomShell } from "../RoomShell";
import {
  type AreaInteraction,
  AvatarArea,
  BookshelfArea,
  DecorationArea,
  DeskArea,
  WindowArea,
} from "./areas";

export interface OfficeEnvironmentProps {
  interaction: AreaInteraction;
  /** Fires when the avatar anchor is clicked, so the camera can frame it. */
  onSelectAvatar?: () => void;
}

/**
 * The composed office environment: room shell plus one component per region.
 * Interactive objects come from the OfficeObjectRegistry (single source of
 * truth) and are dealt to their areas by id — adding an object means one
 * registry entry, one transform, and one area-id line, no scene surgery.
 */
export function OfficeEnvironment({ interaction, onSelectAvatar }: OfficeEnvironmentProps) {
  const nodesByArea = useMemo(() => {
    const nodes = OfficeObjectRegistry.getAll().flatMap<ThreeOfficeNode>((object) => {
      const transform = OBJECT_TRANSFORMS[object.id];
      return transform ? [{ object, transform }] : [];
    });

    const byArea = {} as Record<OfficeArea, ThreeOfficeNode[]>;
    for (const area of Object.values(OfficeArea)) {
      byArea[area] = nodes.filter((node) => AREA_OBJECT_IDS[area].includes(node.object.id));
    }
    return byArea;
  }, []);

  return (
    <group>
      <RoomShell />
      <DeskArea nodes={nodesByArea[OfficeArea.Desk]} interaction={interaction} />
      <BookshelfArea nodes={nodesByArea[OfficeArea.Bookshelf]} interaction={interaction} />
      <WindowArea nodes={nodesByArea[OfficeArea.Window]} interaction={interaction} />
      <DecorationArea nodes={nodesByArea[OfficeArea.Decoration]} interaction={interaction} />
      <AvatarArea onSelect={onSelectAvatar} />
    </group>
  );
}
