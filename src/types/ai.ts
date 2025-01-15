export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export interface AIResponse {
  message: string;
  sources?: SearchResult[];
}

export interface VisionResponse {
  description: string;
  tags: string[];
}

export interface AudioResponse {
  transcript: string;
}

export type AIMode = 'chat' | 'search' | 'vision' | 'audio';