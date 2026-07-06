export interface CameraTransform {
  /** Forward "walk" mapped to a zoom scale (>= 1). */
  scale: number;
  /** Horizontal sway in pixels. */
  offsetX: number;
  /** Vertical bob in pixels. */
  offsetY: number;
}

export interface CameraTransitionOptions {
  /** Total forward-movement duration in milliseconds. */
  duration?: number;
  /** Additional scale reached at the end of the walk. */
  forwardScale?: number;
  swayAmplitudeX?: number;
  swayAmplitudeY?: number;
  /** Sway oscillations per second. */
  swayFrequencyX?: number;
  swayFrequencyY?: number;
}

const DEFAULTS: Required<CameraTransitionOptions> = {
  duration: 4000,
  forwardScale: 0.6,
  swayAmplitudeX: 9,
  swayAmplitudeY: 5,
  swayFrequencyX: 0.55,
  swayFrequencyY: 1.1,
};

/**
 * Frame-driven camera controller for the loader → office transition. Kept free
 * of React and DOM so the same progress/transform model can later back a
 * Three.js / R3F / Spline camera without changing callers.
 */
export class CameraTransitionManager {
  private running = false;
  private elapsed = 0;

  private readonly duration: number;
  private readonly forwardScale: number;
  private readonly swayAmplitudeX: number;
  private readonly swayAmplitudeY: number;
  private readonly swayFrequencyX: number;
  private readonly swayFrequencyY: number;

  constructor(options: CameraTransitionOptions = {}) {
    this.duration = options.duration ?? DEFAULTS.duration;
    this.forwardScale = options.forwardScale ?? DEFAULTS.forwardScale;
    this.swayAmplitudeX = options.swayAmplitudeX ?? DEFAULTS.swayAmplitudeX;
    this.swayAmplitudeY = options.swayAmplitudeY ?? DEFAULTS.swayAmplitudeY;
    this.swayFrequencyX = options.swayFrequencyX ?? DEFAULTS.swayFrequencyX;
    this.swayFrequencyY = options.swayFrequencyY ?? DEFAULTS.swayFrequencyY;
  }

  start(): void {
    this.running = true;
    this.elapsed = 0;
  }

  update(deltaTime: number): void {
    if (!this.running) return;
    this.elapsed = Math.min(this.elapsed + deltaTime, this.duration);
    if (this.elapsed >= this.duration) this.running = false;
  }

  stop(): void {
    this.running = false;
  }

  progress(): number {
    return this.duration > 0 ? Math.min(this.elapsed / this.duration, 1) : 1;
  }

  isRunning(): boolean {
    return this.running;
  }

  getTransform(): CameraTransform {
    const eased = CameraTransitionManager.easeInOut(this.progress());
    const seconds = this.elapsed / 1000;

    return {
      scale: 1 + eased * this.forwardScale,
      offsetX: Math.sin(seconds * this.swayFrequencyX * Math.PI * 2) * this.swayAmplitudeX,
      offsetY: Math.sin(seconds * this.swayFrequencyY * Math.PI * 2) * this.swayAmplitudeY,
    };
  }

  private static easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  }
}
