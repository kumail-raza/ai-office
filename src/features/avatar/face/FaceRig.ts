/**
 * Blend-shape abstraction. A small, model-agnostic set of facial shapes that
 * maps cleanly onto ARKit / Ready Player Me / MetaHuman morph targets and onto
 * the procedural fallback face. Consumers (the expression + eye systems) speak
 * only in FaceShape weights; the concrete FaceRig knows how to realise them.
 */
export enum FaceShape {
  /** Mouth corners up. */
  Smile = "smile",
  /** Mouth corners down. */
  Frown = "frown",
  /** Jaw open (subtle emphasis — NOT lip sync). */
  MouthOpen = "mouthOpen",
  /** Both brows raised — interest / greeting / listening. */
  BrowRaise = "browRaise",
  /** Inner brows drawn down and together — focus / thinking. */
  BrowFurrow = "browFurrow",
  /** Lower lids / cheeks raised — the "smiling eyes" of genuine happiness. */
  EyeSquint = "eyeSquint",
  /** Eyelids closed — driven by the eye controller, not expressions. */
  Blink = "blink",
}

/** A sparse set of shape weights (0–1). Omitted shapes read as 0. */
export type FaceWeights = Partial<Record<FaceShape, number>>;

/** Normalized eye look offset, each axis in [-1, 1]. */
export interface Gaze {
  x: number;
  y: number;
}

/**
 * The surface the presence system drives every frame. One `apply` per frame
 * (weights + gaze) keeps writes single-sourced, so expression, blink, and gaze
 * never clobber each other.
 */
export interface FaceRig {
  /** Whether the underlying model can actually show these shapes. */
  readonly hasBlendShapes: boolean;
  /** Commit this frame's combined facial weights and eye gaze. */
  apply(weights: FaceWeights, gaze: Gaze): void;
}

/** No-op face for models with no blend shapes and no procedural face. */
export const NULL_FACE_RIG: FaceRig = {
  hasBlendShapes: false,
  apply() {
    // Nothing to drive — the avatar still lives via body/head/presence motion.
  },
};
