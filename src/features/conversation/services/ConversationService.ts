import { PromptService } from "./PromptService";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Streams an assistant reply chunk-by-chunk. The shape — an async generator of
 * string deltas driven by an AbortSignal — mirrors the OpenAI streaming API, so
 * swapping the mock body for a real `chat.completions.create({ stream: true })`
 * call requires no changes to callers.
 */
export const ConversationService = {
  async *stream(prompt: string, signal: AbortSignal): AsyncGenerator<string> {
    const reply = PromptService.getReply(prompt);
    const tokens = reply.match(/\s+|\S+/g) ?? [reply];

    for (const token of tokens) {
      if (signal.aborted) return;
      await delay(18 + Math.random() * 34);
      if (signal.aborted) return;
      yield token;
    }
  },
};
