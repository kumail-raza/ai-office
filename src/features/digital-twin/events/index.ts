import { createEmitter } from "@/lib/events/createEmitter";

import type { AvatarExpression, AvatarGesture, AvatarState, ExpressionBlend } from "../types";

export type AvatarRuntimeEventMap = {
  "avatar-state-changed": { from: AvatarState; to: AvatarState };
  "expression-changed": { expression: AvatarExpression; blend: ExpressionBlend[] };
  "gesture-started": { gesture: AvatarGesture };
  "gesture-ended": { gesture: AvatarGesture };
  "speech-started": { requestId?: string };
  "speech-ended": { requestId?: string };
};

export type AvatarRuntimeEventType = keyof AvatarRuntimeEventMap;

/** Global runtime event bus for the digital twin — future 3D/rig consumers subscribe here. */
export const avatarRuntimeEvents = createEmitter<AvatarRuntimeEventMap>();
