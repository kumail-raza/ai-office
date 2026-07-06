import { create } from "zustand";

export type Scene = "landing" | "loader" | "transition" | "office";

/**
 * Smart Door lifecycle. Transitions are guarded (each action only advances
 * from the expected phase) so repeated or out-of-order calls are no-ops —
 * this keeps the animated sequence interrupt-safe.
 */
export type DoorPhase =
  | "idle" // waiting for a valid name + Continue
  | "activating" // panel fading out, arrow travelling to the door
  | "unlocking" // glow + handle rotation
  | "unlocked" // door is clickable
  | "opening" // door swinging open
  | "opened"; // fully open, handing off to the loader

interface AppState {
  scene: Scene;
  visitorName: string;
  doorPhase: DoorPhase;

  setVisitorName: (name: string) => void;

  startActivation: () => void;
  beginUnlock: () => void;
  markUnlocked: () => void;
  openDoor: () => void;
  finishOpening: () => void;

  goToLoader: () => void;
  goToTransition: () => void;
  goToOffice: () => void;
  reset: () => void;
}

const advance = (from: DoorPhase, to: DoorPhase) => (state: AppState) =>
  state.doorPhase === from ? { doorPhase: to } : {};

export const useAppStore = create<AppState>((set) => ({
  scene: "landing",
  visitorName: "",
  doorPhase: "idle",

  setVisitorName: (name) => set({ visitorName: name }),

  startActivation: () => set(advance("idle", "activating")),
  beginUnlock: () => set(advance("activating", "unlocking")),
  markUnlocked: () => set(advance("unlocking", "unlocked")),
  openDoor: () => set(advance("unlocked", "opening")),
  finishOpening: () => set(advance("opening", "opened")),

  goToLoader: () => set({ scene: "loader" }),
  goToTransition: () => set({ scene: "transition" }),
  goToOffice: () => set({ scene: "office" }),
  reset: () => set({ scene: "landing", visitorName: "", doorPhase: "idle" }),
}));
