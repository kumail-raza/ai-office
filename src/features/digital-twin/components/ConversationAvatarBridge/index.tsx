"use client";

import { useEffect } from "react";

import { ConversationStatus, useConversation } from "@/features/conversation";
import { PresenceState, presenceManager } from "@/features/voice";

import { useAvatar } from "../../hooks/useAvatar";
import { AvatarState } from "../../types";

/** How long the twin acknowledges a new message before shifting to thinking. */
const LISTEN_MS = 300;

/**
 * Drives the avatar from the conversation lifecycle:
 *   user sends → LISTENING → THINKING → SPEAKING (response) → IDLE.
 *
 * Headless. It only calls the existing runtime API (useAvatar actions), so the
 * runtime contract is untouched. When voice is active the VoiceManager owns the
 * speaking presence, so we defer the return-to-idle to it in that case.
 */
export function ConversationAvatarBridge() {
  const { status } = useConversation();
  const { actions } = useAvatar();

  useEffect(() => {
    switch (status) {
      case ConversationStatus.Thinking: {
        // A message was just sent: acknowledge by listening, then shift into
        // thinking. (The provider appends the user + reply together, so the
        // status transition is the reliable "just sent" signal.)
        actions.setState(AvatarState.Listening);
        const timer = window.setTimeout(() => actions.setState(AvatarState.Thinking), LISTEN_MS);
        return () => window.clearTimeout(timer);
      }
      case ConversationStatus.Streaming:
        actions.setState(AvatarState.Speaking);
        return;
      case ConversationStatus.Idle:
        // Defer to the voice layer while it is still speaking aloud.
        if (presenceManager.getState() !== PresenceState.Speaking) {
          actions.setState(AvatarState.Idle);
        }
        return;
    }
  }, [status, actions]);

  return null;
}
