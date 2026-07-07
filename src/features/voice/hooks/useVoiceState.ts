"use client";

import { useSyncExternalStore } from "react";

import { IDLE_VOICE_STATE, voiceManager, type VoiceManagerState } from "../services/VoiceManager";

export function useVoiceState(): VoiceManagerState {
  return useSyncExternalStore(
    (onStoreChange) => voiceManager.subscribe(onStoreChange),
    () => voiceManager.getState(),
    () => IDLE_VOICE_STATE,
  );
}
