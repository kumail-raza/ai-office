/** Explicit transition lifecycle — no magic strings. */
export enum TransitionState {
  IDLE = "idle",
  FADING_OUT = "fading_out",
  OUTSIDE_OFFICE = "outside_office",
  CAMERA_MOVING = "camera_moving",
  ENTERING_ROOM = "entering_room",
  COMPLETE = "complete",
}

/** Configurable timings for the loader → office transition (milliseconds). */
export const TRANSITION_TIMING = {
  /** Each fade (to black / into the office). */
  fadeDuration: 600,
  /** Brief hold on the office exterior before the walk begins. */
  exteriorHold: 400,
  /** Forward "walking" camera move. */
  cameraDuration: 4000,
} as const;
