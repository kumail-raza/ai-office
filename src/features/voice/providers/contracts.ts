import type { VoiceProvider } from "../types";

/**
 * Vendor provider CONTRACTS — intentionally interfaces only, per the voice
 * architecture. Implementing one of these (plus `voiceManager.setProvider`)
 * is the entire integration surface for a new vendor; nothing else in the
 * application changes. No vendor SDK code lives in this repo yet.
 */

export interface OpenAITTSProviderConfig {
  apiKey: string;
  model: string;
  voice: string;
}

export interface OpenAITTSProvider extends VoiceProvider {
  readonly kind: "openai-tts";
  configure(config: OpenAITTSProviderConfig): void;
}

export interface ElevenLabsProviderConfig {
  apiKey: string;
  voiceId: string;
  modelId: string;
  stability: number;
  similarityBoost: number;
}

export interface ElevenLabsProvider extends VoiceProvider {
  readonly kind: "elevenlabs";
  configure(config: ElevenLabsProviderConfig): void;
}

export interface CartesiaProviderConfig {
  apiKey: string;
  modelId: string;
  latencyMode: "low" | "balanced" | "quality";
}

export interface CartesiaProvider extends VoiceProvider {
  readonly kind: "cartesia";
  configure(config: CartesiaProviderConfig): void;
}

export interface AzureSpeechProviderConfig {
  subscriptionKey: string;
  region: string;
  voiceName: string;
}

export interface AzureSpeechProvider extends VoiceProvider {
  readonly kind: "azure-speech";
  configure(config: AzureSpeechProviderConfig): void;
}

export interface LocalTTSProviderConfig {
  /** e.g. "web-speech" for the browser SpeechSynthesis API, or a local engine id. */
  engine: string;
  voiceURI?: string;
}

export interface LocalTTSProvider extends VoiceProvider {
  readonly kind: "local-tts";
  configure(config: LocalTTSProviderConfig): void;
}
