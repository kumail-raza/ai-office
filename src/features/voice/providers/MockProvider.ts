import { MOCK_SPEECH } from "../constants";
import type {
  AudioTrack,
  SpeechRequest,
  SpeechResponse,
  VoiceConfig,
  VoicePlayback,
  VoiceProvider,
} from "../types";

/** Reading-pace estimate for the silent mock; exported for unit tests. */
export function estimateSpeechDurationMs(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const spokenMs = (words / MOCK_SPEECH.wordsPerMinute) * 60_000;
  return Math.min(MOCK_SPEECH.maxDurationMs, Math.max(MOCK_SPEECH.minDurationMs, Math.round(spokenMs)));
}

/** Timer-driven stand-in for real audio playback, with pause/resume/stop. */
class TimedPlayback implements VoicePlayback {
  readonly done: Promise<void>;

  private resolveDone!: () => void;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private remainingMs: number;
  private startedAt = 0;
  private finished = false;

  constructor(durationMs: number) {
    this.remainingMs = durationMs;
    this.done = new Promise((resolve) => {
      this.resolveDone = resolve;
    });
    this.run();
  }

  pause(): void {
    if (this.timer === null || this.finished) return;
    clearTimeout(this.timer);
    this.timer = null;
    this.remainingMs -= Date.now() - this.startedAt;
  }

  resume(): void {
    if (this.timer !== null || this.finished) return;
    this.run();
  }

  stop(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.finish();
  }

  private run(): void {
    this.startedAt = Date.now();
    this.timer = setTimeout(() => this.finish(), Math.max(0, this.remainingMs));
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.timer = null;
    this.resolveDone();
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * The only implemented provider for now: silent, timer-paced playback that
 * exercises the full queue/presence/event pipeline so real providers can drop
 * in without touching the VoiceManager or the UI.
 */
export const MockProvider: VoiceProvider = {
  name: "mock",

  async synthesize(
    request: SpeechRequest,
    _config: VoiceConfig,
    _signal: AbortSignal,
  ): Promise<SpeechResponse> {
    await delay(MOCK_SPEECH.synthesisLatencyMs);
    const track: AudioTrack = { id: request.id, durationMs: estimateSpeechDurationMs(request.text) };
    return { requestId: request.id, track };
  },

  play(response: SpeechResponse): VoicePlayback {
    return new TimedPlayback(response.track.durationMs);
  },
};
