import { tokenize } from "./text";
import type { KnowledgeDocument, KnowledgeIndexData, RetrievedDocument } from "./types";

const BM25_K1 = 1.5;
const BM25_B = 0.75;
const SNIPPET_LENGTH = 180;

function termFrequency(tokens: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
  return counts;
}

function scoreDocument(
  document: KnowledgeDocument,
  queryTerms: string[],
  index: KnowledgeIndexData,
): number {
  const frequencies = termFrequency(document.tokens);
  const length = document.tokens.length || 1;

  let score = 0;
  for (const term of queryTerms) {
    const tf = frequencies.get(term);
    if (!tf) continue;
    const idf = index.idf[term] ?? 0;
    const denominator = tf + BM25_K1 * (1 - BM25_B + (BM25_B * length) / index.averageLength);
    score += idf * ((tf * (BM25_K1 + 1)) / denominator);
  }
  return score;
}

function buildSnippet(content: string, queryTerms: string[]): string {
  const lower = content.toLowerCase();
  const firstHit = queryTerms
    .map((term) => lower.indexOf(term))
    .filter((position) => position >= 0)
    .sort((a, b) => a - b)[0];

  const start = firstHit === undefined ? 0 : Math.max(0, firstHit - 40);
  const snippet = content.slice(start, start + SNIPPET_LENGTH).replace(/\s+/g, " ").trim();
  return start > 0 ? `…${snippet}…` : `${snippet}…`;
}

/**
 * Accepts a user question and returns the top matching documents. Lexical BM25,
 * fully provider-independent — no embedding, vector store, or model dependency.
 * A future semantic path would implement the EmbeddingProvider / VectorStore
 * contracts and return the same shape.
 */
export const KnowledgeRetriever = {
  retrieve(index: KnowledgeIndexData, question: string, topK = 3): RetrievedDocument[] {
    const queryTerms = tokenize(question);
    if (queryTerms.length === 0) return [];

    return index.documents
      .map((document) => ({
        document,
        score: scoreDocument(document, queryTerms, index),
        snippet: buildSnippet(document.content, queryTerms),
      }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  },
};
