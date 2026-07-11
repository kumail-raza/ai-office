import { createEmitter } from "@/lib/events/createEmitter";

/** Avatar interaction events, routed through the shared event-emitter factory. */
export type AvatarInteractionEventMap = {
  "avatar-hovered": { hovered: boolean };
  "avatar-clicked": Record<string, never>;
};

/**
 * Feature-local bus for avatar pointer interactions. Uses the same
 * `createEmitter` primitive as the rest of the app rather than extending the
 * digital-twin runtime's fixed event map — interaction is a view concern, and
 * the runtime contract stays untouched.
 */
export const avatarEvents = createEmitter<AvatarInteractionEventMap>();
