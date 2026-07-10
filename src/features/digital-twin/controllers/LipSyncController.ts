import { type AvatarController, type SpeechTiming, type Viseme } from "../types";

/**
 * Provider-independent lip-sync contract. Deliberately NOT implemented yet — a
 * real engine (Audio2Face, a viseme-emitting TTS, a phoneme aligner, …)
 * implements this later and registers with the AvatarManager; nothing else
 * changes.
 */
export interface LipSyncController extends AvatarController {
  /** Load the timing for the utterance about to play. */
  setSpeech(timing: SpeechTiming | null): void;
  /** Sample active visemes at a playback time — the seam a mouth rig reads each frame. */
  sampleVisemes(timeMs: number): Viseme[];
  clear(): void;
}

/** No-op placeholder so the runtime has a registered lip-sync controller. */
export class NoopLipSyncController implements LipSyncController {
  readonly id = "lip-sync";

  onStateChange(): void {
    // No behavior until a real lip-sync provider is implemented.
  }

  setSpeech(): void {}

  sampleVisemes(): Viseme[] {
    return [];
  }

  clear(): void {}
}
