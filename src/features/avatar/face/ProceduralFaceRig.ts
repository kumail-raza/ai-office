import type { Object3D } from "three";

import { type FaceRig, FaceShape, type FaceWeights, type Gaze } from "./FaceRig";

/**
 * The mutable face nodes of the procedural avatar. All are children of the head
 * group, so they inherit head motion for free.
 */
export interface ProceduralFaceParts {
  pupilLeft: Object3D;
  pupilRight: Object3D;
  lidLeft: Object3D;
  lidRight: Object3D;
  browLeft: Object3D;
  browRight: Object3D;
  mouth: Object3D;
}

/** Rest positions captured once so weights modulate around the neutral face. */
interface Rest {
  browY: number;
  mouthY: number;
  pupilLX: number;
  pupilRX: number;
  pupilY: number;
}

const GAZE_RANGE = 0.03;

/**
 * Realises FaceShape weights on the procedural face by transforming its parts —
 * eyelid scale for blink, brow position/rotation for raise/furrow, mouth
 * scale/position for smile/open, pupil offset for gaze. The graceful fallback
 * that always has blend shapes because it builds them from primitives.
 */
export class ProceduralFaceRig implements FaceRig {
  readonly hasBlendShapes = true;
  private readonly rest: Rest;

  constructor(private readonly parts: ProceduralFaceParts) {
    this.rest = {
      browY: parts.browLeft.position.y,
      mouthY: parts.mouth.position.y,
      pupilLX: parts.pupilLeft.position.x,
      pupilRX: parts.pupilRight.position.x,
      pupilY: parts.pupilLeft.position.y,
    };
  }

  apply(weights: FaceWeights, gaze: Gaze): void {
    const smile = weights[FaceShape.Smile] ?? 0;
    const frown = weights[FaceShape.Frown] ?? 0;
    const mouthOpen = weights[FaceShape.MouthOpen] ?? 0;
    const browRaise = weights[FaceShape.BrowRaise] ?? 0;
    const browFurrow = weights[FaceShape.BrowFurrow] ?? 0;
    const squint = weights[FaceShape.EyeSquint] ?? 0;
    const blink = weights[FaceShape.Blink] ?? 0;

    // Eyelids: close on blink, and ride down a little on a squint.
    const lidClose = Math.min(1, blink + squint * 0.4);
    this.parts.lidLeft.scale.y = lidClose;
    this.parts.lidRight.scale.y = lidClose;

    // Brows: raise lifts both; furrow lowers and angles the inner ends in.
    const browY = this.rest.browY + browRaise * 0.03 - browFurrow * 0.025;
    this.parts.browLeft.position.y = browY;
    this.parts.browRight.position.y = browY;
    this.parts.browLeft.rotation.z = -browFurrow * 0.4;
    this.parts.browRight.rotation.z = browFurrow * 0.4;

    // Mouth: smile widens + lifts, frown lowers, open scales vertically.
    this.parts.mouth.scale.x = 1 + smile * 0.35;
    this.parts.mouth.scale.y = 1 + mouthOpen * 1.6;
    this.parts.mouth.position.y = this.rest.mouthY + smile * 0.015 - frown * 0.02;

    // Gaze: shift both pupils together.
    this.parts.pupilLeft.position.x = this.rest.pupilLX + gaze.x * GAZE_RANGE;
    this.parts.pupilRight.position.x = this.rest.pupilRX + gaze.x * GAZE_RANGE;
    this.parts.pupilLeft.position.y = this.rest.pupilY + gaze.y * GAZE_RANGE;
    this.parts.pupilRight.position.y = this.rest.pupilY + gaze.y * GAZE_RANGE;
  }
}
