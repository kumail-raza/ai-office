import { FaceShape } from "./FaceRig";

/**
 * FaceShape → candidate morph-target names, following the ARKit blend-shape
 * vocabulary that Ready Player Me and most MetaHuman/GLB exports adopt. Every
 * matching target found on the model is driven together, so left/right pairs
 * move as one. Unknown targets are simply skipped (graceful degradation).
 */
export const MORPH_TARGETS: Record<FaceShape, string[]> = {
  [FaceShape.Smile]: ["mouthSmileLeft", "mouthSmileRight", "mouthSmile"],
  [FaceShape.Frown]: ["mouthFrownLeft", "mouthFrownRight", "mouthFrown"],
  [FaceShape.MouthOpen]: ["jawOpen", "mouthOpen"],
  [FaceShape.BrowRaise]: ["browInnerUp", "browOuterUpLeft", "browOuterUpRight"],
  [FaceShape.BrowFurrow]: ["browDownLeft", "browDownRight"],
  [FaceShape.EyeSquint]: ["eyeSquintLeft", "eyeSquintRight", "cheekSquintLeft", "cheekSquintRight"],
  [FaceShape.Blink]: ["eyeBlinkLeft", "eyeBlinkRight", "eyesClosed"],
};

/** Eye-gaze morph targets, when the model provides them (ARKit look shapes). */
export const GAZE_MORPHS = {
  lookLeft: ["eyeLookOutLeft", "eyeLookInRight"],
  lookRight: ["eyeLookOutRight", "eyeLookInLeft"],
  lookUp: ["eyeLookUpLeft", "eyeLookUpRight"],
  lookDown: ["eyeLookDownLeft", "eyeLookDownRight"],
} as const;
