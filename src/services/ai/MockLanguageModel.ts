import type { AssembledPrompt } from "@/features/knowledge/types";

import type { LanguageModel } from "./LanguageModel";

const FALLBACK =
  "I don't have that in my notes yet — but I'd be glad to connect you with the real Kumail. You can ask me about my projects, cloud & AWS work, AI solutions, or how to hire me.";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildAnswer(prompt: AssembledPrompt): string {
  if (prompt.citations.length === 0) return FALLBACK;

  const sections = prompt.context
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
 * Placeholder model for development. It grounds its output in the retrieved
 * context (no invented facts) and streams token-by-token, matching the real
 * streaming contract so it can be swapped for a provider adapter unchanged.
 */
export const MockLanguageModel: LanguageModel = {
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
