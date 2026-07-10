import { avatarRuntimeEvents } from "../events";
import { RUNTIME_CONFIG, STATE_GESTURE } from "../constants";
import { type AvatarController, AvatarGesture, type AvatarState } from "../types";

/**
 * Drives gestures. `play` runs a one-shot gesture that auto-returns to Idle;
 * continuous gestures (e.g. Typing while working) are set from state. Emits
 * gesture-started / gesture-ended — the timing hooks a future animation clip
 * system binds to.
 */
export class GestureController implements AvatarController {
  readonly id = "gesture";

  private current: AvatarGesture = AvatarGesture.Idle;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly onChange: () => void) {}

  onStateChange(state: AvatarState): void {
    const implied = STATE_GESTURE[state];
    if (implied !== undefined) this.setContinuous(implied);
  }

  /** One-shot gesture that emits started, holds for `durationMs`, then ends to Idle. */
  play(gesture: AvatarGesture, durationMs: number = RUNTIME_CONFIG.defaultGestureMs): void {
    this.clearTimer();
    this.current = gesture;
    avatarRuntimeEvents.emit("gesture-started", { gesture });
    this.onChange();

    this.timer = setTimeout(() => {
      this.timer = null;
      avatarRuntimeEvents.emit("gesture-ended", { gesture });
      this.setContinuous(AvatarGesture.Idle);
    }, durationMs);
  }

  /** Set an ongoing gesture with no auto-end (state-driven). */
  setContinuous(gesture: AvatarGesture): void {
    this.clearTimer();
    if (gesture === this.current) return;
    this.current = gesture;
    this.onChange();
  }

  getCurrent(): AvatarGesture {
    return this.current;
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
