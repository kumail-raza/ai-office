"use client";

import { useEffect, useRef } from "react";

import { ConversationStatus, MessageRole, useConversation } from "@/features/conversation";
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
  const { status, messages } = useConversation();
  const { actions } = useAvatar();
  const prevCount = useRef(messages.length);

  // A newly sent user message → acknowledge by listening.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (messages.length > prevCount.current && last?.role === MessageRole.User) {
      actions.setState(AvatarState.Listening);
    }
    prevCount.current = messages.length;
  }, [messages, actions]);

  // Conversation status → avatar state.
  useEffect(() => {
    switch (status) {
      case ConversationStatus.Thinking: {
        // Hold the listening beat briefly, then shift into thinking.
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
