/**
 * Contract for a vector database. Intentionally NOT implemented. Implement this
 * to back retrieval with a vector store (pgvector, Pinecone, Qdrant, …); the
 * KnowledgeRetriever's return shape stays the same.
 */
export interface VectorRecord {
  id: string;
  vector: number[];
  metadata: Record<string, unknown>;
}

export interface VectorMatch {
  id: string;
  score: number;
  metadata: Record<string, unknown>;
}

export interface VectorStore {
  readonly name: string;
  upsert(records: VectorRecord[]): Promise<void>;
  query(vector: number[], topK: number): Promise<VectorMatch[]>;
}
