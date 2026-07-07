/**
 * Contract for turning text into vectors. Intentionally NOT implemented — the
 * current retriever is lexical. Implement this to enable semantic embeddings
 * (OpenAI, Cohere, a local model, …) without touching retrieval callers.
 */
export interface EmbeddingProvider {
  readonly name: string;
  readonly dimensions: number;
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}
