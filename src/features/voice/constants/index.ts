import type { VoiceConfig } from "../types";

export const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  voiceId: "kumail-default",
  rate: 1,
  pitch: 1,
  volume: 0.9,
};

export const MOCK_SPEECH = {
  wordsPerMinute: 170,
  minDurationMs: 600,
  /** Placeholder cap so long replies don't monopolize the mock voice — real providers replace this pacing entirely. */
  maxDurationMs: 12000,
  synthesisLatencyMs: 120,
} as const;
