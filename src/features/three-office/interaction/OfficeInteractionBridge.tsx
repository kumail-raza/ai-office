"use client";

import { useEffect } from "react";

import { AvatarState, avatarManager } from "@/features/digital-twin";
import { recruiterAnalytics } from "@/features/recruiter";
import { useRecruiterStore } from "@/stores/recruiter.store";

// Side-effect import: instantiating the analytics singleton subscribes it to the
// interaction bus, so zone/interaction events are tracked wherever this mounts.
import "./InteractionAnalytics";
import { interactionEvents } from "./interactionEvents";
import { BridgeTarget } from "./zones";

/**
 * Context bridge: office interaction → existing experiences. A non-visual DOM
 * component that listens for `interaction-started` (emitted by the in-canvas
 * InteractionManager) and routes each zone to the feature it already owns —
 * opening no new UI, only invoking existing public entry points:
 *
 *   Recruiter zone  → Recruiter Mode    (app-wide recruiter store)
 *   Digital Twin    → conversation mode (avatar runtime: transition to Listening)
 *   Profile zone    → no experience yet (focus + analytics only)
 *
 * The Projects zone is handled inside the projects feature itself (its
 * open-state is feature-local, so ProjectExperienceLauncher subscribes to this
 * same bus) — see that component. This bridge routes only the targets backed by
 * app-wide singletons. It never mutates a feature's contract; it calls the same
 * methods the on-screen toggles do.
 */
export function OfficeInteractionBridge() {
  useEffect(() => {
    return interactionEvents.on("interaction-started", ({ bridge }) => {
      switch (bridge) {
        case BridgeTarget.Recruiter:
          if (!useRecruiterStore.getState().isRecruiterMode) {
            recruiterAnalytics.trackModeEntered();
            useRecruiterStore.getState().enterRecruiterMode();
          }
          break;
        case BridgeTarget.Conversation:
          // "Activate conversation mode" via the runtime's existing public API —
          // the scene already frames the avatar on Listening/Thinking/Speaking.
          avatarManager.transition(AvatarState.Listening);
          break;
        case BridgeTarget.Projects:
        case BridgeTarget.None:
          // Projects: owned by the projects feature (see ProjectExperienceLauncher).
          // None (Profile): focus + analytics only, no experience to open.
          break;
      }
    });
  }, []);

  return null;
}
