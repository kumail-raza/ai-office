import { CitationBuilder } from "./CitationBuilder";
import type { AssembledPrompt, SearchResult } from "../types";

const SYSTEM_PROMPT = [
  "You are Kumail's AI digital twin — his portfolio assistant.",
  "Answer as Kumail, in first person, warm and concise.",
  "Use ONLY the provided context. If it doesn't cover the question, say so and",
  "offer to connect the visitor with the real Kumail.",
  "Reference sources by their bracketed number when helpful.",
].join(" ");

const FALLBACK_CONTEXT =
  "No matching knowledge was found for this question.";

/**
 * Builds a provider-independent prompt from the query and retrieved documents.
 * The result is a neutral { system, context, user, citations } shape; each model
 * adapter (OpenAI, Claude, Gemini, local) maps it to its own message format.
 */
export const PromptAssembler = {
  assemble(query: string, results: SearchResult[]): AssembledPrompt {
    const context =
      results.length === 0
        ? FALLBACK_CONTEXT
        : results
            .map((result, index) => `[${index + 1}] ${result.document.title}\n${result.document.content}`)
            .join("\n\n---\n\n");

    return {
      system: SYSTEM_PROMPT,
      context,
      user: query,
      citations: CitationBuilder.build(results),
    };
  },
};
