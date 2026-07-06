"use client";

import { createContext, useContext } from "react";

import type { ConversationStatus, Message } from "../types";

export interface ConversationContextValue {
  messages: Message[];
  status: ConversationStatus;
  voiceEnabled: boolean;
  isBusy: boolean;
  sendMessage: (text: string) => void;
  stopGeneration: () => void;
  toggleVoice: () => void;
}

export const ConversationContext = createContext<ConversationContextValue | null>(null);

export function useConversation(): ConversationContextValue {
  const value = useContext(ConversationContext);
  if (value === null) {
    throw new Error("useConversation must be used within a ConversationProvider");
  }
  return value;
}
