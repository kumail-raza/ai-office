import { KnowledgeService } from "./KnowledgeService";
import type { KnowledgeDocument, KnowledgeIndex, SearchResult } from "../types";

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
  index: KnowledgeIndex,
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
  const bodyStart = content.indexOf("\n") + 1;
  const firstHit = queryTerms
    .map((term) => lower.indexOf(term, bodyStart))
    .filter((position) => position >= 0)
    .sort((a, b) => a - b)[0];

  const start = firstHit === undefined ? bodyStart : Math.max(bodyStart, firstHit - 40);
  const snippet = content.slice(start, start + SNIPPET_LENGTH).replace(/\s+/g, " ").trim();
  return start > bodyStart ? `…${snippet}…` : `${snippet}…`;
}

/**
 * Retrieves the most relevant documents for a query. The default scorer is
 * lexical BM25 (no external services). The `embeddings` seam is where a vector
 * search backend plugs in later — the return shape stays identical, so callers
 * are unaffected.
 */
export const SearchService = {
  search(index: KnowledgeIndex, query: string, topK = 3): SearchResult[] {
    const queryTerms = KnowledgeService.tokenize(query);
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
