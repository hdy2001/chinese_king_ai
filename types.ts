export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastModified: number;
}

export interface SystemState {
  currentSessionId: string | null;
  sessions: ChatSession[];
  isLoading: boolean;
}