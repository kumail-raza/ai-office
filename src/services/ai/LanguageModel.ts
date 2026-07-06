import type { AssembledPrompt } from "@/features/knowledge/types";

/**
 * Provider-independent language model contract. The knowledge layer produces an
 * `AssembledPrompt`; an adapter for OpenAI, Claude, Gemini, or a local model maps
 * that neutral shape to its own request and yields text deltas. Swapping models
 * never touches retrieval, prompting, or the UI.
 */
export interface LanguageModel {
  readonly name: string;
  stream(prompt: AssembledPrompt, signal: AbortSignal): AsyncGenerator<string>;
}
