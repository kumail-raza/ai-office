export interface KnowledgeDocument {
  id: string;
  path: string;
  title: string;
  category: string;
  content: string;
  tokens: string[];
}

export interface KnowledgeIndex {
  documents: KnowledgeDocument[];
  idf: Record<string, number>;
  averageLength: number;
}

export interface SearchResult {
  document: KnowledgeDocument;
  score: number;
  snippet: string;
}

export interface Citation {
  id: string;
  title: string;
  path: string;
  category: string;
}

export interface AssembledPrompt {
  system: string;
  context: string;
  user: string;
  citations: Citation[];
}
