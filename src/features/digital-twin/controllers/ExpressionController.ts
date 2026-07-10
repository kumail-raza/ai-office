import { avatarRuntimeEvents } from "../events";
import { STATE_EXPRESSION } from "../constants";
import {
  type AvatarController,
  AvatarExpression,
  type AvatarState,
  type ExpressionBlend,
} from "../types";

/**
 * Owns the avatar's facial expression as a weighted blend, so a future facial
 * rig can map each expression to blend-shape coefficients. Emits
 * `expression-changed` on discrete changes only.
 */
export class ExpressionController implements AvatarController {
  readonly id = "expression";

  private current: AvatarExpression = AvatarExpression.Neutral;
  private blend: ExpressionBlend[] = [{ expression: AvatarExpression.Neutral, weight: 1 }];

  constructor(private readonly onChange: () => void) {}

  onStateChange(state: AvatarState): void {
    this.setExpression(STATE_EXPRESSION[state]);
  }

  setExpression(expression: AvatarExpression): void {
    if (expression === this.current && this.blend.length === 1) return;
    this.current = expression;
    this.blend = [{ expression, weight: 1 }];
    avatarRuntimeEvents.emit("expression-changed", { expression, blend: this.blend });
    this.onChange();
  }

  /** Cross-fade toward `target` at `weight` (0–1); at weight >= 1 it becomes current. */
  blendTo(target: AvatarExpression, weight: number): void {
    const clamped = Math.min(1, Math.max(0, weight));
    if (clamped >= 1) {
      this.setExpression(target);
      return;
    }
    this.blend = [
      { expression: this.current, weight: 1 - clamped },
      { expression: target, weight: clamped },
    ];
    avatarRuntimeEvents.emit("expression-changed", { expression: this.current, blend: this.blend });
    this.onChange();
  }

  getExpression(): AvatarExpression {
    return this.current;
  }

  getBlend(): ExpressionBlend[] {
    return this.blend;
  }
}
