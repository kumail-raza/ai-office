import type { Object3D } from "three";

import {
  type FaceRig,
  MorphFaceRig,
  NULL_FACE_RIG,
  ProceduralFaceRig,
  type ProceduralFaceParts,
} from "../face";

/**
 * Chooses the FaceRig for a model — the single decision point that keeps
 * expressions working on every avatar:
 *
 *   - a GLB with ARKit-style morph targets → MorphFaceRig (blend shapes)
 *   - a GLB with no facial rig at all → NULL_FACE_RIG (body/head motion still
 *     carries presence; expressions degrade silently, never crash)
 *   - the procedural figure → ProceduralFaceRig (transforms its face parts)
 *
 * Consumers keep speaking FaceShape weights regardless of which rig realises
 * them, so the expression system needs no per-model knowledge.
 */
export const ExpressionAdapter = {
  /** Face rig for a loaded GLB/GLTF scene. */
  forModel(scene: Object3D): FaceRig {
    const morphRig = new MorphFaceRig(scene);
    return morphRig.hasBlendShapes ? morphRig : NULL_FACE_RIG;
  },

  /** Face rig for the procedural fallback figure. */
  forProcedural(parts: ProceduralFaceParts): FaceRig {
    return new ProceduralFaceRig(parts);
  },
};
