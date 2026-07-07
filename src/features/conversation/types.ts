export enum MessageRole {
  System = "system",
  Assistant = "assistant",
  User = "user",
}

export enum MessageStatus {
  Thinking = "thinking",
  Typing = "typing",
  Complete = "complete",
  Error = "error",
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  createdAt: number;
}

export enum ConversationStatus {
  Idle = "idle",
  Thinking = "thinking",
  Streaming = "streaming",
}

export interface QuickAction {
  id: string;
  label: string;
  prompt: string;
}

/**
 * Lightweight context describing the project a visitor is currently viewing.
 * When set, it's sent alongside each message so the assistant can answer
 * questions grounded in that specific project.
 */
export interface ProjectContext {
  slug: string;
  title: string;
  summary: string;
}
