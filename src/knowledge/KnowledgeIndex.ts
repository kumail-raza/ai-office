import type { KnowledgeDocument, KnowledgeIndexData } from "./types";

/**
 * Builds a lexical search index (inverse document frequencies + average length)
 * from loaded documents. Pure and deterministic — unit-test friendly.
 */
export const KnowledgeIndex = {
  build(documents: KnowledgeDocument[]): KnowledgeIndexData {
    const documentFrequency = new Map<string, number>();
    for (const document of documents) {
      for (const term of new Set(document.tokens)) {
        documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
      }
    }

    const total = documents.length || 1;
    const idf: Record<string, number> = {};
    for (const [term, frequency] of documentFrequency) {
      idf[term] = Math.log(1 + (total - frequency + 0.5) / (frequency + 0.5));
    }

    const averageLength =
      documents.reduce((sum, document) => sum + document.tokens.length, 0) / total;

    return { documents, idf, averageLength: averageLength || 1 };
  },
};
