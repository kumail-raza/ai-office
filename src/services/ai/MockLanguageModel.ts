import type { LLMProvider } from "@/knowledge/contracts";
import type { AssembledPrompt } from "@/knowledge/types";

const FALLBACK =
  "I don't have that in my notes yet — but I'd be glad to connect you with the real Kumail. You can ask me about my projects, cloud & AWS work, AI solutions, or how to hire me.";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildAnswer(prompt: AssembledPrompt): string {
  if (prompt.citations.length === 0) return FALLBACK;

  const sections = prompt.knowledge
    .split("\n\n---\n\n")
    .map((section) =>
      section
        .replace(/^\[\d+\][^\n]*\n/, "")
        .replace(/^#\s+[^\n]*\n+/, "")
        .trim(),
    )
    .filter(Boolean);

  return `Here's what's relevant from my background:\n\n${sections.join("\n\n")}`;
}

/**
 * Development stand-in that satisfies the LLMProvider contract. It grounds its
 * output in the assembled knowledge (no invented facts) and streams token by
 * token, so a real provider adapter can replace it unchanged.
 */
export const MockLanguageModel: LLMProvider = {
  name: "mock",

  async *stream(prompt, signal) {
    const answer = buildAnswer(prompt);
    const tokens = answer.match(/\s+|\S+/g) ?? [answer];

    for (const token of tokens) {
      if (signal.aborted) return;
      await delay(14 + Math.random() * 28);
      if (signal.aborted) return;
      yield token;
    }
  },
};
