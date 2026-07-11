/**
 * Placeholder audio manager.
 *
 * No real audio files are wired yet — these methods only prepare the call
 * sites so real playback can be dropped in later without touching callers.
 */
class AudioManager {
  doorUnlock(): void {
    this.play("door-unlock");
  }

  doorOpen(): void {
    this.play("door-open");
  }

  officeAmbience(): void {
    this.play("office-ambience");
  }

  playAmbient(): void {
    this.play("ambient-start");
  }

  stopAmbient(): void {
    this.play("ambient-stop");
  }

  private play(cue: string): void {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[AudioManager] cue: ${cue} (placeholder — no audio yet)`);
    }
  }
}

export const audioManager = new AudioManager();
export { AudioManager };
