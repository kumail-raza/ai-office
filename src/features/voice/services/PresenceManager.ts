import { PresenceState } from "../types";

type PresenceListener = () => void;

/**
 * Single source of truth for the digital twin's presence state (IDLE,
 * LISTENING, THINKING, SPEAKING, PROCESSING, ERROR). Subscribable and
 * framework-free; React reads it through the usePresence hook. This is the
 * signal that will later drive avatar expressions, eye contact, lip sync, and
 * animations.
 */
class PresenceManager {
  private state: PresenceState = PresenceState.Idle;
  private readonly listeners = new Set<PresenceListener>();

  getState(): PresenceState {
    return this.state;
  }

  setState(next: PresenceState): void {
    if (next === this.state) return;
    this.state = next;
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: PresenceListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const presenceManager = new PresenceManager();
