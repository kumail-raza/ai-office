import { createEmitter } from "@/lib/events/createEmitter";

import type { BridgeTarget, InteractionZoneId } from "./zones";

/** Payload shared by every zone event. */
export interface ZoneEventPayload {
  zoneId: InteractionZoneId;
  /** Registry object the zone frames, or null (e.g. the Digital Twin zone). */
  targetObjectId: string | null;
  bridge: BridgeTarget;
}

/**
 * Office interaction events, on the same `createEmitter` primitive the rest of
 * the app uses. This is the seam that carries interaction across the R3F canvas
 * → DOM boundary (like `avatarEvents`): the in-canvas InteractionManager emits,
 * while the DOM-side bridge and analytics subscribe. Zone/interaction concerns
 * stay a view layer — no runtime, conversation, or knowledge contract is touched.
 */
export type OfficeInteractionEventMap = {
  "zone-entered": ZoneEventPayload;
  "zone-left": ZoneEventPayload;
  "interaction-started": ZoneEventPayload;
  "interaction-completed": ZoneEventPayload;
};

export const interactionEvents = createEmitter<OfficeInteractionEventMap>();
