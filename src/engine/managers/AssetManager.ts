import { CRITICAL_IMAGES, FALLBACK_IMAGE } from "./assetManifest";

type AssetStatus = "loading" | "loaded" | "fallback";

interface AssetRecord {
  status: AssetStatus;
  promise: Promise<HTMLImageElement>;
}

interface AssetResource<T> {
  read(): T;
}

type ProgressListener = (loaded: number, total: number) => void;

const isBrowser = typeof window !== "undefined";

function wrapPromise<T>(promise: Promise<T>): AssetResource<T> {
  let status: "pending" | "success" | "error" = "pending";
  let result: T;
  let error: unknown;

  const suspender = promise.then(
    (value) => {
      status = "success";
      result = value;
    },
    (reason) => {
      status = "error";
      error = reason;
    },
  );

  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw error;
      return result;
    },
  };
}

class AssetManager {
  private cache = new Map<string, AssetRecord>();
  private listeners = new Set<ProgressListener>();
  private loadedCount = 0;
  private totalCount = 0;
  private criticalResource: AssetResource<void> | null = null;

  private loadImage(src: string): Promise<HTMLImageElement> {
    if (!isBrowser) {
      return Promise.resolve({} as HTMLImageElement);
    }

    return new Promise((resolve) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = () => {
        const fallback = new Image();
        fallback.onload = () => resolve(fallback);
        fallback.onerror = () => resolve(fallback);
        fallback.src = FALLBACK_IMAGE;
      };

      image.src = src;
    });
  }

  preload(src: string): Promise<HTMLImageElement> {
    const cached = this.cache.get(src);
    if (cached) return cached.promise;

    const promise = this.loadImage(src);
    const record: AssetRecord = { status: "loading", promise };
    this.cache.set(src, record);

    void promise.then((image) => {
      record.status = image.src?.includes(FALLBACK_IMAGE) ? "fallback" : "loaded";
    });

    return promise;
  }

  async preloadAll(sources: readonly string[]): Promise<void> {
    this.totalCount = sources.length;
    this.loadedCount = 0;
    this.emitProgress();

    await Promise.all(
      sources.map((src) =>
        this.preload(src).finally(() => {
          this.loadedCount += 1;
          this.emitProgress();
        }),
      ),
    );
  }

  preloadSecondary(sources: readonly string[]): void {
    if (!isBrowser) return;

    const schedule =
      window.requestIdleCallback?.bind(window) ?? ((cb: () => void) => window.setTimeout(cb, 200));

    schedule(() => {
      sources.forEach((src) => this.preload(src));
    });
  }

  getCriticalResource(): AssetResource<void> {
    if (!this.criticalResource) {
      this.criticalResource = isBrowser
        ? wrapPromise(this.preloadAll(CRITICAL_IMAGES))
        : { read: () => undefined };
    }

    return this.criticalResource;
  }

  getProgress(): { loaded: number; total: number } {
    return { loaded: this.loadedCount, total: this.totalCount };
  }

  subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emitProgress(): void {
    this.listeners.forEach((listener) => listener(this.loadedCount, this.totalCount));
  }
}

export const assetManager = new AssetManager();
export type { AssetResource };
