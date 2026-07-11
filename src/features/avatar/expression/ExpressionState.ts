import { AvatarExpression } from "@/features/digital-twin";

import { FaceShape, type FaceWeights } from "../face";

/**
 * The single source of truth mapping each runtime AvatarExpression to a target
 * set of facial blend-shape weights. The ExpressionManager reads this; nothing
 * else hardcodes face weights.
 */
export const EXPRESSION_FACE: Record<AvatarExpression, FaceWeights> = {
  [AvatarExpression.Neutral]: {},
  [AvatarExpression.Happy]: {
    [FaceShape.Smile]: 0.85,
    [FaceShape.EyeSquint]: 0.5,
    [FaceShape.BrowRaise]: 0.2,
  },
  [AvatarExpression.Focused]: {
    [FaceShape.BrowFurrow]: 0.6,
  },
  [AvatarExpression.Thinking]: {
    [FaceShape.BrowFurrow]: 0.4,
    [FaceShape.BrowRaise]: 0.15,
  },
  [AvatarExpression.Listening]: {
    [FaceShape.BrowRaise]: 0.45,
    [FaceShape.Smile]: 0.2,
  },
  [AvatarExpression.Speaking]: {
    [FaceShape.Smile]: 0.3,
    [FaceShape.MouthOpen]: 0.15,
  },
  [AvatarExpression.Greeting]: {
    [FaceShape.Smile]: 1,
    [FaceShape.EyeSquint]: 0.5,
    [FaceShape.BrowRaise]: 0.6,
  },
};

/** Every non-blink shape the expression layer is allowed to drive. */
export const EXPRESSION_SHAPES: FaceShape[] = [
  FaceShape.Smile,
  FaceShape.Frown,
  FaceShape.MouthOpen,
  FaceShape.BrowRaise,
  FaceShape.BrowFurrow,
  FaceShape.EyeSquint,
];
