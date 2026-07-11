import { lerp } from "@/lib/math/vector";

import { type FaceShape, type FaceWeights } from "../face";
import { EXPRESSION_SHAPES } from "./ExpressionState";

/**
 * Low-level weighted-blend engine for facial shapes. Holds a current weight per
 * shape and eases each toward its target every frame, so expression changes
 * crossfade smoothly — never a hard switch. Frame-rate-independent easing.
 */
export class ExpressionController {
  private readonly current = new Map<FaceShape, number>();
  private readonly target = new Map<FaceShape, number>();

  constructor(private smoothing = 0.1) {
    for (const shape of EXPRESSION_SHAPES) {
      this.current.set(shape, 0);
      this.target.set(shape, 0);
    }
  }

  /** Set the target weights (missing shapes relax to 0). */
  setTarget(weights: FaceWeights): void {
    for (const shape of EXPRESSION_SHAPES) {
      this.target.set(shape, weights[shape] ?? 0);
    }
  }

  /** Ease current toward target for this frame. */
  update(deltaSec: number): void {
    const alpha = 1 - (1 - this.smoothing) ** (deltaSec / (1 / 60));
    for (const shape of EXPRESSION_SHAPES) {
      const now = this.current.get(shape) ?? 0;
      const to = this.target.get(shape) ?? 0;
      this.current.set(shape, lerp(now, to, alpha));
    }
  }

  /** Current eased weights, ready to merge into a FaceRig.apply call. */
  getWeights(): FaceWeights {
    const weights: FaceWeights = {};
    for (const shape of EXPRESSION_SHAPES) {
      const value = this.current.get(shape) ?? 0;
      if (value > 0.001) weights[shape] = value;
    }
    return weights;
  }
}
