"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

import { audioManager } from "@/engine/managers/AudioManager";

import { ConversationService, type ConversationTurn } from "../services/ConversationService";
import { MessageService } from "../services/MessageService";
import { ConversationStatus, type Message, MessageRole, MessageStatus } from "../types";
import { ConversationContext, type ConversationContextValue } from "./ConversationContext";

interface ConversationProviderProps {
  children: ReactNode;
  initialMessages?: Message[];
}

export function ConversationProvider({ children, initialMessages = [] }: ConversationProviderProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [status, setStatus] = useState<ConversationStatus>(ConversationStatus.Idle);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const busyRef = useRef(false);
  const voiceRef = useRef(voiceEnabled);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const buildHistory = useCallback(
    (): ConversationTurn[] =>
      messagesRef.current
        .filter(
          (message) =>
            message.status === MessageStatus.Complete &&
            (message.role === MessageRole.User || message.role === MessageRole.Assistant),
        )
        .map((message) => ({
          role: message.role === MessageRole.User ? "user" : "assistant",
          content: message.content,
        })),
    [],
  );

  const patch = useCallback((messageId: string, changes: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((message) => (message.id === messageId ? { ...message, ...changes } : message)),
    );
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length === 0 || busyRef.current) return;

      busyRef.current = true;
      const controller = new AbortController();
      abortRef.current = controller;
      const history = buildHistory();

      const user = MessageService.createUser(trimmed);
      const reply = MessageService.createThinking();
      setMessages((prev) => [...prev, user, reply]);
      setStatus(ConversationStatus.Thinking);

      try {
        await new Promise((resolve) => setTimeout(resolve, 550));
        if (controller.signal.aborted) return;

        setStatus(ConversationStatus.Streaming);
        patch(reply.id, { status: MessageStatus.Typing });

        let content = "";
        for await (const chunk of ConversationService.stream(trimmed, history, controller.signal)) {
          content += chunk;
          patch(reply.id, { content });
        }

        patch(reply.id, { status: MessageStatus.Complete });
        if (voiceRef.current) audioManager.speak(content);
      } catch {
        patch(reply.id, {
          status: MessageStatus.Error,
          content: "Sorry — something went wrong. Please try again.",
        });
      } finally {
        busyRef.current = false;
        abortRef.current = null;
        setStatus(ConversationStatus.Idle);
      }
    },
    [patch, buildHistory],
  );

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    setMessages((prev) =>
      prev.map((message) =>
        message.status === MessageStatus.Typing || message.status === MessageStatus.Thinking
          ? { ...message, status: MessageStatus.Complete }
          : message,
      ),
    );
    busyRef.current = false;
    setStatus(ConversationStatus.Idle);
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((previous) => {
      voiceRef.current = !previous;
      return !previous;
    });
  }, []);

  const value: ConversationContextValue = {
    messages,
    status,
    voiceEnabled,
    isBusy: status !== ConversationStatus.Idle,
    sendMessage,
    stopGeneration,
    toggleVoice,
  };

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
}
