/**
 * Dev-only live readout channel from the in-canvas avatar systems to the DOM
 * debug panel: runtime status (state, animation, expression, focus, avatar
 * type) reported per frame by the PresenceSystem, plus static model info
 * (loaded, skeleton, morph targets, clip count) reported once at mount by the
 * render layer. Listeners are only notified when a value actually changes, so
 * the DOM never re-renders at frame rate.
 *
 * Deliberately three.js-free (string/number snapshot only) — the debug panel is
 * rendered by the eagerly-loaded launcher and must not pull in the 3D stack.
 */
export interface AvatarStatusSnapshot {
  /* ── runtime (per-frame) ── */
  state: string;
  animation: string;
  expression: string;
  /** Active focus target name, or "ambient" when runtime-driven. */
  focus: string;
  /** Rig type of the model being driven (e.g. "procedural", "ready-player-me"). */
  avatarType: string;
  /** Active presence behaviour profile (idle / listening / thinking / speaking). */
  profile: string;
  /** Active idle behaviour (steady / glance / weight-shift). */
  behavior: string;
  /** Running count of blinks this session. */
  blinkCount: number;
  /* ── model (per-mount) ── */
  /** Whether a real .glb loaded (false = procedural placeholder). */
  loaded: boolean;
  /** Whether a bound skeleton was detected. */
  skeletonFound: boolean;
  /** Whether facial morph targets were detected. */
  morphTargetsFound: boolean;
  /** Number of animation clips the model shipped with. */
  animationClips: number;
}

/** The runtime subset the PresenceSystem reports each frame. */
export type AvatarRuntimeStatus = Pick<
  AvatarStatusSnapshot,
  "state" | "animation" | "expression" | "focus" | "avatarType" | "profile" | "behavior" | "blinkCount"
>;

/** The static subset the render layer reports once per mounted model. */
export type AvatarModelStatus = Pick<
  AvatarStatusSnapshot,
  "loaded" | "skeletonFound" | "morphTargetsFound" | "animationClips"
>;

const INITIAL: AvatarStatusSnapshot = {
  state: "idle",
  animation: "idle",
  expression: "neutral",
  focus: "ambient",
  avatarType: "procedural",
  profile: "idle",
  behavior: "steady",
  blinkCount: 0,
  loaded: false,
  skeletonFound: false,
  morphTargetsFound: false,
  animationClips: 0,
};

class AvatarStatusChannel {
  private snapshot: AvatarStatusSnapshot = INITIAL;
  private readonly listeners = new Set<() => void>();

  getSnapshot(): AvatarStatusSnapshot {
    return this.snapshot;
  }

  /** Report per-frame runtime status; notifies only if a value changed. */
  report(next: AvatarRuntimeStatus): void {
    const c = this.snapshot;
    if (
      next.state === c.state &&
      next.animation === c.animation &&
      next.expression === c.expression &&
      next.focus === c.focus &&
      next.avatarType === c.avatarType &&
      next.profile === c.profile &&
      next.behavior === c.behavior &&
      next.blinkCount === c.blinkCount
    ) {
      return;
    }
    this.snapshot = { ...c, ...next };
    this.notify();
  }

  /** Report static model info at mount; notifies only if a value changed. */
  reportModel(next: AvatarModelStatus): void {
    const c = this.snapshot;
    if (
      next.loaded === c.loaded &&
      next.skeletonFound === c.skeletonFound &&
      next.morphTargetsFound === c.morphTargetsFound &&
      next.animationClips === c.animationClips
    ) {
      return;
    }
    this.snapshot = { ...c, ...next };
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const avatarStatus = new AvatarStatusChannel();
