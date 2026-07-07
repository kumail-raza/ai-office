/**
 * Presence of the digital twin. Later drives avatar expressions, eye contact,
 * lip sync, and animations — consumers read it through PresenceManager.
 */
export enum PresenceState {
  Idle = "idle",
  Listening = "listening",
  Thinking = "thinking",
  Speaking = "speaking",
  Processing = "processing",
  Error = "error",
}

export enum SpeechPriority {
  Normal = "normal",
  High = "high",
}

export interface VoiceConfig {
  voiceId: string;
  /** Playback rate multiplier (1 = normal). */
  rate: number;
  /** Pitch multiplier (1 = normal). */
  pitch: number;
  /** Volume, 0–1. */
  volume: number;
}

export interface SpeechRequest {
  id: string;
  text: string;
  priority: SpeechPriority;
  /** Per-utterance overrides merged over the active VoiceConfig. */
  config?: Partial<VoiceConfig>;
}

/** Lip-sync cue for future avatar mouth animation (digital-twin providers). */
export interface VisemeCue {
  timeMs: number;
  viseme: string;
}

export interface AudioTrack {
  id: string;
  durationMs: number;
  /** Playable source (object/remote URL) once a real provider returns audio. */
  src?: string;
  visemes?: VisemeCue[];
}

export interface SpeechResponse {
  requestId: string;
  track: AudioTrack;
}

/** Playback controls a provider returns for one utterance. */
export interface VoicePlayback {
  /** Resolves when playback finishes or is stopped — never rejects. */
  readonly done: Promise<void>;
  pause(): void;
  resume(): void;
  stop(): void;
}

/**
 * Provider-agnostic speech synthesis contract. Every vendor (ElevenLabs,
 * Cartesia, OpenAI TTS, Azure, HeyGen/Tavus twins, local engines) plugs in by
 * implementing this — no vendor code exists anywhere else in the app.
 */
export interface VoiceProvider {
  readonly name: string;
  synthesize(request: SpeechRequest, config: VoiceConfig, signal: AbortSignal): Promise<SpeechResponse>;
  play(response: SpeechResponse): VoicePlayback;
  /** Optional streaming synthesis — providers that support it yield chunks as they arrive. */
  synthesizeStream?(
    request: SpeechRequest,
    config: VoiceConfig,
    signal: AbortSignal,
  ): AsyncGenerator<AudioTrack>;
}

/** Ordered, priority-aware queue of pending speech. */
export interface SpeechQueue {
  enqueue(request: SpeechRequest): void;
  dequeue(): SpeechRequest | undefined;
  peek(): SpeechRequest | undefined;
  /** Cancel a queued (not yet speaking) request by id. */
  remove(id: string): boolean;
  clear(): void;
  size(): number;
}
