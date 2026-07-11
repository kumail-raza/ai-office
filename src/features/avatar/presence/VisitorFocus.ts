import type { Gaze } from "../face";

/** A named thing the avatar can look at, as a normalized gaze direction. */
export interface FocusTarget {
  name: string;
  direction: Gaze;
}

/**
 * Manages what the avatar is paying attention to. It supports any number of
 * registered targets and one active focus; when nothing is explicitly focused
 * it returns null and the eye/head controllers fall back to the runtime's own
 * gaze direction (ambient behaviour).
 *
 * Today the conversation flow drives focus implicitly through runtime state, so
 * the default (null) path is used — this class is the future-ready seam for
 * "look at the visitor", "look at this project", multi-visitor scenarios, etc.
 */
export class VisitorFocus {
  private readonly targets = new Map<string, Gaze>();
  private active: string | null = null;

  register(target: FocusTarget): void {
    this.targets.set(target.name, target.direction);
  }

  /** Focus a registered target by name (no-op if unknown). */
  acquire(name: string): void {
    if (this.targets.has(name)) this.active = name;
  }

  /** Drop focus and return to ambient (runtime-driven) gaze. */
  release(): void {
    this.active = null;
  }

  /** The active focus direction, or null when ambient. */
  getActiveDirection(): Gaze | null {
    if (!this.active) return null;
    return this.targets.get(this.active) ?? null;
  }
}
