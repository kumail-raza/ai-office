import { PresenceState, presenceManager } from "@/features/voice";

import { avatarManager } from "./AvatarManager";
import { AvatarState } from "../types";

/** Maps the voice layer's presence to an avatar state. */
export function presenceToAvatarState(presence: PresenceState): AvatarState {
  switch (presence) {
    case PresenceState.Listening:
      return AvatarState.Listening;
    case PresenceState.Thinking:
    case PresenceState.Processing:
      return AvatarState.Thinking;
    case PresenceState.Speaking:
      return AvatarState.Speaking;
    case PresenceState.Error:
      return AvatarState.Error;
    default:
      return AvatarState.Idle;
  }
}

/**
 * Connects the Phase 9 PresenceManager to the AvatarManager so voice presence
 * drives avatar state (LISTENING → attentive, THINKING → focused, SPEAKING →
 * speaking). Returns an unsubscribe function.
 */
export function connectPresenceToAvatar(): () => void {
  const sync = () => avatarManager.setState(presenceToAvatarState(presenceManager.getState()));
  sync();
  return presenceManager.subscribe(sync);
}
