import { avatarEvents } from "@/engine/events";
import { createId } from "@/lib/id";

import { DEFAULT_VOICE_CONFIG } from "../constants";
import { MockProvider } from "../providers/MockProvider";
import {
  PresenceState,
  SpeechPriority,
  type SpeechRequest,
  type VoiceConfig,
  type VoicePlayback,
  type VoiceProvider,
} from "../types";
import { presenceManager } from "./PresenceManager";
import { PrioritySpeechQueue } from "./SpeechQueue";
import { voiceAnalytics } from "./VoiceAnalytics";

export interface VoiceManagerState {
  status: "idle" | "speaking" | "paused";
  current: SpeechRequest | null;
  queueLength: number;
}

export const IDLE_VOICE_STATE: VoiceManagerState = { status: "idle", current: null, queueLength: 0 };

interface ActiveSpeech {
  request: SpeechRequest;
  playback: VoicePlayback | null;
  abort: AbortController;
}

interface SpeakOptions {
  priority?: SpeechPriority;
  config?: Partial<VoiceConfig>;
}

/**
 * Single source of truth for spoken output. Owns the speech queue, drives the
 * active provider, emits avatar events, updates presence, and records
 * analytics. Providers are swappable via setProvider() — the rest of the app
 * never talks to a provider directly.
 */
class VoiceManager {
  private provider: VoiceProvider = MockProvider;
  private config: VoiceConfig = DEFAULT_VOICE_CONFIG;
  private readonly pending = new PrioritySpeechQueue();
  private active: ActiveSpeech | null = null;
  private paused = false;
  private readonly listeners = new Set<() => void>();
  private snapshot: VoiceManagerState = IDLE_VOICE_STATE;

  setProvider(provider: VoiceProvider): void {
    this.provider = provider;
  }

  setConfig(config: Partial<VoiceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /** Enqueue text to be spoken; returns the speech request id. */
  speak(text: string, options: SpeakOptions = {}): string {
    const request: SpeechRequest = {
      id: createId("speech"),
      text: text.trim(),
      priority: options.priority ?? SpeechPriority.Normal,
      config: options.config,
    };
    if (request.text.length > 0) this.queue(request);
    return request.id;
  }

  /** Enqueue a fully-formed request. */
  queue(request: SpeechRequest): void {
    this.pending.enqueue(request);
    void this.processNext();
    this.publish();
  }

  /** Stop the current utterance and speak this text next, ahead of the queue. */
  interrupt(text: string): string {
    const request: SpeechRequest = {
      id: createId("speech"),
      text: text.trim(),
      priority: SpeechPriority.High,
    };
    if (request.text.length > 0) this.pending.enqueue(request);
    this.stopActive();
    void this.processNext();
    this.publish();
    return request.id;
  }

  /** Cancel one request — the active utterance or a queued one — by id. */
  cancel(id: string): boolean {
    if (this.active?.request.id === id) {
      this.stopActive();
      return true;
    }
    const removed = this.pending.remove(id);
    if (removed) this.publish();
    return removed;
  }

  /** Stop the current utterance and clear everything queued. */
  stop(): void {
    this.pending.clear();
    this.stopActive();
    this.publish();
  }

  /** Pause the active playback (no-op while synthesis is still in flight). */
  pause(): void {
    if (this.active?.playback == null || this.paused) return;
    this.paused = true;
    this.active.playback.pause();
    presenceManager.setState(PresenceState.Idle);
    this.publish();
  }

  resume(): void {
    if (this.active?.playback == null || !this.paused) return;
    this.paused = false;
    this.active.playback.resume();
    presenceManager.setState(PresenceState.Speaking);
    this.publish();
  }

  isSpeaking(): boolean {
    return this.active !== null;
  }

  currentSpeech(): SpeechRequest | null {
    return this.active?.request ?? null;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): VoiceManagerState {
    return this.snapshot;
  }

  private async processNext(): Promise<void> {
    // Claimed synchronously before the first await, so callers can rely on
    // isSpeaking() being true immediately after speak()/queue() returns.
    if (this.active !== null) return;
    const request = this.pending.dequeue();
    if (request === undefined) return;

    const abort = new AbortController();
    const active: ActiveSpeech = { request, playback: null, abort };
    this.active = active;
    this.paused = false;

    presenceManager.setState(PresenceState.Speaking);
    avatarEvents.emit("speech-start", request.id);
    voiceAnalytics.trackSpeechStarted();
    this.publish();

    let completed = false;
    try {
      const response = await this.provider.synthesize(
        request,
        { ...this.config, ...request.config },
        abort.signal,
      );
      if (!abort.signal.aborted) {
        const playback = this.provider.play(response);
        active.playback = playback;
        await playback.done;
        completed = !abort.signal.aborted;
      }
    } catch {
      presenceManager.setState(PresenceState.Error);
    } finally {
      this.active = null;
      this.paused = false;
      avatarEvents.emit("speech-end", request.id);
      if (completed) voiceAnalytics.trackSpeechCompleted();
      this.publish();

      if (this.pending.size() > 0) {
        void this.processNext();
      } else if (presenceManager.getState() === PresenceState.Speaking) {
        presenceManager.setState(PresenceState.Idle);
      }
    }
  }

  private stopActive(): void {
    if (this.active === null) return;
    voiceAnalytics.trackSpeechInterrupted();
    this.active.abort.abort();
    // Cleanup (state, events, queue continuation) happens in processNext's finally.
    this.active.playback?.stop();
  }

  private publish(): void {
    this.snapshot = {
      status: this.active === null ? "idle" : this.paused ? "paused" : "speaking",
      current: this.active?.request ?? null,
      queueLength: this.pending.size(),
    };
    this.listeners.forEach((listener) => listener());
  }
}

export const voiceManager = new VoiceManager();
