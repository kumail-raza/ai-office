/**
 * Dev-only live readout channel from the in-canvas avatar systems to the DOM
 * debug panel: state, semantic animation, expression, focus target and avatar
 * type. The PresenceSystem reports every frame; listeners are only notified
 * when a value actually changes, so the DOM never re-renders at frame rate.
 *
 * Deliberately three.js-free (string snapshot only) — the debug panel is
 * rendered by the eagerly-loaded launcher and must not pull in the 3D stack.
 */
export interface AvatarStatusSnapshot {
  state: string;
  animation: string;
  expression: string;
  /** Active focus target name, or "ambient" when runtime-driven. */
  focus: string;
  /** Rig type of the model being driven (e.g. "procedural", "ready-player-me"). */
  avatarType: string;
}

const INITIAL: AvatarStatusSnapshot = {
  state: "idle",
  animation: "idle",
  expression: "neutral",
  focus: "ambient",
  avatarType: "procedural",
};

class AvatarStatusChannel {
  private snapshot: AvatarStatusSnapshot = INITIAL;
  private readonly listeners = new Set<() => void>();

  getSnapshot(): AvatarStatusSnapshot {
    return this.snapshot;
  }

  /** Report this frame's status; notifies only if something changed. */
  report(next: AvatarStatusSnapshot): void {
    const current = this.snapshot;
    if (
      next.state === current.state &&
      next.animation === current.animation &&
      next.expression === current.expression &&
      next.focus === current.focus &&
      next.avatarType === current.avatarType
    ) {
      return;
    }
    this.snapshot = next;
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const avatarStatus = new AvatarStatusChannel();
