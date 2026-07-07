export interface KnowledgeMetadata {
  title: string;
  category: string;
  tags: string[];
  headings: string[];
  summary?: string;
}

export interface KnowledgeDocument {
  id: string;
  path: string;
  metadata: KnowledgeMetadata;
  content: string;
  tokens: string[];
}

export interface KnowledgeIndexData {
  documents: KnowledgeDocument[];
  idf: Record<string, number>;
  averageLength: number;
}

export interface RetrievedDocument {
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

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AssembledPrompt {
  system: string;
  knowledge: string;
  history: ConversationTurn[];
  user: string;
  citations: Citation[];
}
