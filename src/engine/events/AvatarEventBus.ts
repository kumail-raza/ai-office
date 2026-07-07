export type AvatarEventType =
  | "speech-start"
  | "speech-end"
  | "thinking-start"
  | "thinking-end"
  | "listening-start"
  | "listening-end";

export interface AvatarEvent {
  type: AvatarEventType;
  /** Optional payload, e.g. the speech request id that started/ended. */
  detail?: string;
  timestamp: number;
}

export type AvatarEventHandler = (event: AvatarEvent) => void;

/**
 * Globally available pub/sub bus for avatar-facing moments. The voice and
 * conversation layers emit; future consumers (avatar expressions, eye contact,
 * lip sync, animations) subscribe without coupling to either producer.
 * Framework-free, like the other engine systems.
 */
class AvatarEventBus {
  private readonly handlers = new Map<AvatarEventType | "*", Set<AvatarEventHandler>>();

  /** Subscribe to one event type, or "*" for every event. Returns an unsubscribe function. */
  on(type: AvatarEventType | "*", handler: AvatarEventHandler): () => void {
    const set = this.handlers.get(type) ?? new Set<AvatarEventHandler>();
    set.add(handler);
    this.handlers.set(type, set);
    return () => {
      set.delete(handler);
    };
  }

  emit(type: AvatarEventType, detail?: string): void {
    const event: AvatarEvent = { type, detail, timestamp: Date.now() };
    this.handlers.get(type)?.forEach((handler) => handler(event));
    this.handlers.get("*")?.forEach((handler) => handler(event));
  }
}

export const avatarEvents = new AvatarEventBus();
