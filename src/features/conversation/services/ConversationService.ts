export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

/**
 * Client-side transport for the conversation. Streams the assistant reply from
 * the knowledge-backed API route as an async generator of string deltas — the
 * same shape as the OpenAI streaming API — so the provider behind the route can
 * change without touching the UI or the provider store.
 */
export const ConversationService = {
  async *stream(
    message: string,
    history: ConversationTurn[],
    signal: AbortSignal,
  ): AsyncGenerator<string> {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      signal,
    });

    if (!response.ok || response.body === null) {
      throw new Error(`Chat request failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value, { stream: true });
      }
    } catch (error) {
      if (signal.aborted) return;
      throw error;
    } finally {
      reader.releaseLock();
    }
  },
};
