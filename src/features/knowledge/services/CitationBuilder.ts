import type { Citation, SearchResult } from "../types";

/** Turns retrieval results into structured citations (returned internally). */
export const CitationBuilder = {
  build(results: SearchResult[]): Citation[] {
    return results.map((result) => ({
      id: result.document.id,
      title: result.document.title,
      path: result.document.path,
      category: result.document.category,
    }));
  },
};
