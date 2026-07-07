import { SpeechPriority, type SpeechQueue, type SpeechRequest } from "../types";

/**
 * SpeechQueue implementation: FIFO within a priority band, with High-priority
 * requests always ahead of Normal ones. Pure and framework-free — unit-test
 * friendly.
 */
export class PrioritySpeechQueue implements SpeechQueue {
  private items: SpeechRequest[] = [];

  enqueue(request: SpeechRequest): void {
    if (request.priority === SpeechPriority.High) {
      const firstNormal = this.items.findIndex((item) => item.priority !== SpeechPriority.High);
      if (firstNormal === -1) this.items.push(request);
      else this.items.splice(firstNormal, 0, request);
      return;
    }
    this.items.push(request);
  }

  dequeue(): SpeechRequest | undefined {
    return this.items.shift();
  }

  peek(): SpeechRequest | undefined {
    return this.items[0];
  }

  remove(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  clear(): void {
    this.items = [];
  }

  size(): number {
    return this.items.length;
  }
}
