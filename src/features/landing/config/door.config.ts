import { DURATION, EASING } from "@/config/motion";

/**
 * All Smart Door interaction timings and motion values live here.
 * Nothing about the door sequence should be hardcoded in components.
 */
export const DOOR_CONFIG = {
  /** Glowing arrow travelling from the Continue button toward the door. */
  arrowTravel: {
    duration: 0.9,
    ease: EASING.emphasized,
  },
  /** Visitor panel fade-out once Continue is pressed. */
  panelFadeOut: {
    duration: DURATION.base,
    ease: EASING.exit,
  },
  /** Unlock window: soft glow + handle rotation. */
  unlock: {
    duration: DURATION.slow,
    ease: EASING.standard,
    /** Degrees the handle rotates when unlocking. */
    handleRotation: -22,
  },
  /** Door swing (rotate around the left hinge) — about one second. */
  open: {
    duration: 1,
    ease: EASING.emphasized,
    /** rotateY target for the fully open door. */
    hingeAngle: -108,
  },
  /** Continuous breathing light on the door once active. */
  breathing: {
    duration: 2.6,
    ease: EASING.standard,
  },
  /** Hover feedback while the door is unlocked. */
  hover: {
    duration: DURATION.fast,
    ease: EASING.standard,
  },
} as const;
