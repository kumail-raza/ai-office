export type EmitterListener<E> = (event: E) => void;

export interface TypedEmitter<EventMap extends Record<string, unknown>> {
  /** Subscribe to one event type. Returns an unsubscribe function. */
  on<K extends keyof EventMap>(type: K, listener: EmitterListener<EventMap[K]>): () => void;
  /** Subscribe to every event. Returns an unsubscribe function. */
  onAny(listener: (type: keyof EventMap, event: EventMap[keyof EventMap]) => void): () => void;
  emit<K extends keyof EventMap>(type: K, event: EventMap[K]): void;
}

/**
 * Small strongly-typed pub/sub emitter. Shared so feature event buses don't each
 * re-implement subscribe/emit.
 */
export function createEmitter<EventMap extends Record<string, unknown>>(): TypedEmitter<EventMap> {
  const handlers = new Map<keyof EventMap, Set<EmitterListener<EventMap[keyof EventMap]>>>();
  const anyHandlers = new Set<(type: keyof EventMap, event: EventMap[keyof EventMap]) => void>();

  return {
    on(type, listener) {
      const set = handlers.get(type) ?? new Set();
      set.add(listener as EmitterListener<EventMap[keyof EventMap]>);
      handlers.set(type, set);
      return () => {
        set.delete(listener as EmitterListener<EventMap[keyof EventMap]>);
      };
    },
    onAny(listener) {
      anyHandlers.add(listener);
      return () => {
        anyHandlers.delete(listener);
      };
    },
    emit(type, event) {
      handlers.get(type)?.forEach((listener) => listener(event as EventMap[keyof EventMap]));
      anyHandlers.forEach((listener) => listener(type, event as EventMap[keyof EventMap]));
    },
  };
}
