import type {
  AssembledPrompt,
  Citation,
  ConversationTurn,
  RetrievedDocument,
} from "./types";

const SYSTEM_PROMPT = [
  "You are Kumail's AI digital twin — his portfolio assistant.",
  "Answer as Kumail, in first person, warm and concise.",
  "Use ONLY the provided knowledge. If it doesn't cover the question, say so and",
  "offer to connect the visitor with the real Kumail.",
  "Reference sources by their bracketed number when helpful.",
].join(" ");

const NO_KNOWLEDGE = "No matching knowledge was found for this question.";

interface AssembleInput {
  documents: RetrievedDocument[];
  history: ConversationTurn[];
  userMessage: string;
}

function toCitations(documents: RetrievedDocument[]): Citation[] {
  return documents.map((result) => ({
    id: result.document.id,
    title: result.document.metadata.title,
    path: result.document.path,
    category: result.document.metadata.category,
  }));
}

/**
 * Combines the system prompt, retrieved knowledge, conversation history, and the
 * latest user message into one neutral prompt. Provider-independent — a model
 * adapter maps this shape to its own request format.
 */
export const PromptAssembler = {
  assemble({ documents, history, userMessage }: AssembleInput): AssembledPrompt {
    const knowledge =
      documents.length === 0
        ? NO_KNOWLEDGE
        : documents
            .map(
              (result, index) =>
                `[${index + 1}] ${result.document.metadata.title}\n${result.document.content}`,
            )
            .join("\n\n---\n\n");

    return {
      system: SYSTEM_PROMPT,
      knowledge,
      history,
      user: userMessage,
      citations: toCitations(documents),
    };
  },
};
