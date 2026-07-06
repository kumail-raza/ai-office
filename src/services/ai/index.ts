import { MockLanguageModel } from "./MockLanguageModel";
import type { LanguageModel } from "./LanguageModel";

export type { LanguageModel } from "./LanguageModel";
export { MockLanguageModel } from "./MockLanguageModel";

/**
 * Single place to select the active model. Swap the return value for an
 * OpenAI / Claude / Gemini / local adapter when ready — callers are unaffected.
 */
export function getLanguageModel(): LanguageModel {
  return MockLanguageModel;
}
