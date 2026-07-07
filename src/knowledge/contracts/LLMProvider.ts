import type { AssembledPrompt } from "../types";

/**
 * Contract for a language model. Intentionally NOT implemented here. Implement
 * this to add OpenAI / Claude / Gemini / a local model — it consumes the neutral
 * AssembledPrompt and yields text deltas, so nothing upstream changes.
 */
export interface LLMProvider {
  readonly name: string;
  stream(prompt: AssembledPrompt, signal: AbortSignal): AsyncGenerator<string>;
}
