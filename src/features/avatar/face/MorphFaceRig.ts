import { type Mesh, type Object3D } from "three";

import { type FaceRig, type FaceShape, type FaceWeights, type Gaze } from "./FaceRig";
import { GAZE_MORPHS, MORPH_TARGETS } from "./morphMap";

interface MorphBinding {
  influences: number[];
  index: number;
}

function hasMorphs(object: Object3D): object is Mesh {
  const mesh = object as Mesh;
  return Boolean(mesh.morphTargetDictionary && mesh.morphTargetInfluences);
}

/**
 * Drives a GLB/GLTF model's morph targets (blend shapes) from FaceShape
 * weights. On construction it scans every skinned/mesh node for the ARKit-style
 * targets in the morph map and caches bindings; `apply` writes the influences.
 * If the model carries no matching targets, `hasBlendShapes` is false and the
 * presence system falls back to body/head motion only — never a crash.
 *
 * This is the seam that makes Ready Player Me / MetaHuman-exported / custom GLB
 * faces work with no code change: only the name map is model-specific.
 */
export class MorphFaceRig implements FaceRig {
  readonly hasBlendShapes: boolean;
  private readonly shapeBindings = new Map<FaceShape, MorphBinding[]>();
  private readonly gazeBindings: Record<keyof typeof GAZE_MORPHS, MorphBinding[]> = {
    lookLeft: [],
    lookRight: [],
    lookUp: [],
    lookDown: [],
  };

  constructor(root: Object3D) {
    const meshes: Mesh[] = [];
    root.traverse((node) => {
      if (hasMorphs(node)) meshes.push(node);
    });

    const bind = (names: readonly string[]): MorphBinding[] => {
      const bindings: MorphBinding[] = [];
      for (const mesh of meshes) {
        const dict = mesh.morphTargetDictionary;
        const influences = mesh.morphTargetInfluences;
        if (!dict || !influences) continue;
        for (const name of names) {
          const index = dict[name];
          if (index !== undefined) bindings.push({ influences, index });
        }
      }
      return bindings;
    };

    let found = 0;
    for (const shape of Object.keys(MORPH_TARGETS) as FaceShape[]) {
      const bindings = bind(MORPH_TARGETS[shape]);
      if (bindings.length > 0) found += bindings.length;
      this.shapeBindings.set(shape, bindings);
    }
    for (const key of Object.keys(GAZE_MORPHS) as (keyof typeof GAZE_MORPHS)[]) {
      this.gazeBindings[key] = bind(GAZE_MORPHS[key]);
    }

    this.hasBlendShapes = found > 0;
  }

  apply(weights: FaceWeights, gaze: Gaze): void {
    for (const [shape, bindings] of this.shapeBindings) {
      const weight = weights[shape] ?? 0;
      for (const { influences, index } of bindings) influences[index] = weight;
    }

    // Gaze via ARKit eye-look targets when present (else eyes stay forward;
    // procedural models offset the pupils instead).
    this.setGaze("lookLeft", Math.max(0, -gaze.x));
    this.setGaze("lookRight", Math.max(0, gaze.x));
    this.setGaze("lookUp", Math.max(0, gaze.y));
    this.setGaze("lookDown", Math.max(0, -gaze.y));
  }

  private setGaze(key: keyof typeof GAZE_MORPHS, weight: number): void {
    for (const { influences, index } of this.gazeBindings[key]) influences[index] = weight;
  }
}
