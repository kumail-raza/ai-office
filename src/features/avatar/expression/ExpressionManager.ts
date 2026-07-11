import { AvatarExpression } from "@/features/digital-twin";

import { type FaceWeights } from "../face";
import { ExpressionController } from "./ExpressionController";
import { EXPRESSION_FACE } from "./ExpressionState";

/**
 * High-level facial expression owner. Translates a runtime AvatarExpression into
 * its target blend-shape weights (via EXPRESSION_FACE) and lets the
 * ExpressionController crossfade toward them. A dev override can pin an
 * expression for testing without touching the runtime.
 */
export class ExpressionManager {
  private readonly controller: ExpressionController;
  private active: AvatarExpression = AvatarExpression.Neutral;
  private override: AvatarExpression | null = null;

  constructor(smoothing?: number) {
    this.controller = new ExpressionController(smoothing);
  }

  /** Drive the target from the runtime expression (ignored while overridden). */
  setExpression(expression: AvatarExpression): void {
    this.active = expression;
    if (this.override === null) this.controller.setTarget(EXPRESSION_FACE[expression]);
  }

  /** Dev-only: pin an expression, or pass null to resume runtime control. */
  setOverride(expression: AvatarExpression | null): void {
    this.override = expression;
    const effective = expression ?? this.active;
    this.controller.setTarget(EXPRESSION_FACE[effective]);
  }

  update(deltaSec: number): void {
    this.controller.update(deltaSec);
  }

  getWeights(): FaceWeights {
    return this.controller.getWeights();
  }
}
