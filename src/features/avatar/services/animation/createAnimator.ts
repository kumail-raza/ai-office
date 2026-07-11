import type { AnimationClip } from "three";

import type { AvatarAnimator, AvatarRig } from "../../types";
import { ClipAnimator } from "./ClipAnimator";
import { ProceduralAnimator } from "./ProceduralAnimator";

/**
 * Picks the animator for a model by capability: a rig carrying animation clips
 * plays them (ClipAnimator); anything else — the procedural figure, or a static
 * GLB — is hand-animated (ProceduralAnimator). The one decision point that
 * keeps the office avatar-source-agnostic.
 */
export function createAnimator(rig: AvatarRig, clips: AnimationClip[]): AvatarAnimator {
  if (clips.length > 0) return new ClipAnimator(rig.root, clips);
  return new ProceduralAnimator();
}
