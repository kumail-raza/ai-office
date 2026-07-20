"use client";

import { useMemo } from "react";

import { OfficeObjectRegistry } from "@/features/office";

import { OBJECT_TRANSFORMS } from "../../constants";
import { officeEnvironmentManager } from "../../managers/OfficeEnvironmentManager";
import type { ThreeOfficeNode } from "../../types";
import { RoomShell } from "../RoomShell";
import { type AreaInteraction, OfficeZone } from "./areas";

export interface OfficeEnvironmentProps {
  interaction: AreaInteraction;
  /** Fires when the avatar is clicked, so the camera can frame it. */
  onSelectAvatar?: () => void;
}

/**
 * The composed office: the architectural shell plus every enabled zone, in the
 * order the OfficeEnvironmentManager declares. Interactive objects come from the
 * OfficeObjectRegistry (single source of truth) and are dealt to their zone by
 * id — adding a prop means one zone-config line, no scene surgery.
 */
export function OfficeEnvironment({ interaction, onSelectAvatar }: OfficeEnvironmentProps) {
  const zones = officeEnvironmentManager.getZones();

  const nodesById = useMemo(() => {
    const map = new Map<string, ThreeOfficeNode>();
    for (const object of OfficeObjectRegistry.getAll()) {
      const transform = OBJECT_TRANSFORMS[object.id];
      if (transform) map.set(object.id, { object, transform });
    }
    return map;
  }, []);

  return (
    <group>
      <RoomShell />
      {zones.map((zone) => (
        <OfficeZone
          key={zone.id}
          zone={zone}
          nodes={zone.objectIds.flatMap((id) => {
            const node = nodesById.get(id);
            return node ? [node] : [];
          })}
          interaction={interaction}
          onSelectAvatar={onSelectAvatar}
        />
      ))}
    </group>
  );
}
