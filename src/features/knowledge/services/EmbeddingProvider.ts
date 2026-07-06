/**
 * Provider-agnostic embedding contract. Intentionally interface-only for now —
 * the default retrieval path is lexical (see SearchService). When a vector
 * database / embedding model is introduced (OpenAI, Cohere, a local model, …),
 * implement this and hand it to SearchService; no other code needs to change.
 */
export interface EmbeddingProvider {
  readonly name: string;
  readonly dimensions: number;
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}
