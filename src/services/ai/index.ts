import type { LLMProvider } from "@/knowledge/contracts";

import { MockLanguageModel } from "./MockLanguageModel";

export { MockLanguageModel } from "./MockLanguageModel";

/**
 * Single place to select the active model. Swap the return value for an
 * OpenAI / Claude / Gemini / local adapter (implementing LLMProvider) when
 * ready — callers are unaffected.
 */
export function getLanguageModel(): LLMProvider {
  return MockLanguageModel;
}
