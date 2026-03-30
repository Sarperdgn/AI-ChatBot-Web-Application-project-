export type Role = 'user' | 'assistant';

export interface Conversation {
  id: string;
  title: string;
  preview: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
}
