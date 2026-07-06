import { type Message, MessageRole, MessageStatus } from "../types";

function id(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Factory for the various message shapes — keeps construction in one place. */
export const MessageService = {
  id,

  createUser(content: string): Message {
    return { id: id(), role: MessageRole.User, content, status: MessageStatus.Complete, createdAt: Date.now() };
  },

  createAssistant(content = "", status: MessageStatus = MessageStatus.Complete): Message {
    return { id: id(), role: MessageRole.Assistant, content, status, createdAt: Date.now() };
  },

  createSystem(content: string): Message {
    return { id: id(), role: MessageRole.System, content, status: MessageStatus.Complete, createdAt: Date.now() };
  },

  createThinking(): Message {
    return { id: id(), role: MessageRole.Assistant, content: "", status: MessageStatus.Thinking, createdAt: Date.now() };
  },
};
