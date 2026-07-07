import "server-only";

import { KnowledgeIndex } from "./KnowledgeIndex";
import { KnowledgeLoader } from "./KnowledgeLoader";
import { KnowledgeRetriever } from "./KnowledgeRetriever";
import type { KnowledgeIndexData, RetrievedDocument } from "./types";

const isProduction = process.env.NODE_ENV === "production";

let cachedIndex: KnowledgeIndexData | null = null;

/**
 * Public entry point for the knowledge engine. Composes the loader, index, and
 * retriever behind a small surface. The index is cached in production and
 * rebuilt on every call in development, so markdown edits hot-reload without a
 * restart.
 */
export const KnowledgeProvider = {
  async getIndex(): Promise<KnowledgeIndexData> {
    if (isProduction && cachedIndex) return cachedIndex;

    const documents = await KnowledgeLoader.load();
    cachedIndex = KnowledgeIndex.build(documents);
    return cachedIndex;
  },

  async retrieve(question: string, topK = 3): Promise<RetrievedDocument[]> {
    const index = await this.getIndex();
    return KnowledgeRetriever.retrieve(index, question, topK);
  },
};
