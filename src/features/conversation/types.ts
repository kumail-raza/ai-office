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
