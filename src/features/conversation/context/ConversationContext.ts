"use client";

import { createContext, useContext } from "react";

import type { ConversationStatus, Message, ProjectContext } from "../types";

export interface ConversationContextValue {
  messages: Message[];
  status: ConversationStatus;
  voiceEnabled: boolean;
  isBusy: boolean;
  projectContext: ProjectContext | null;
  sendMessage: (text: string) => void;
  stopGeneration: () => void;
  toggleVoice: () => void;
  setProjectContext: (context: ProjectContext | null) => void;
}

export const ConversationContext = createContext<ConversationContextValue | null>(null);

export function useConversation(): ConversationContextValue {
  const value = useContext(ConversationContext);
  if (value === null) {
    throw new Error("useConversation must be used within a ConversationProvider");
  }
  return value;
}
