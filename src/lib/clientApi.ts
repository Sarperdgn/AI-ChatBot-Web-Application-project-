import type { Conversation, Message } from '@/types/chat';

export async function listConversations(): Promise<Conversation[]> {
  const response = await fetch('/api/conversations');
  if (!response.ok) throw new Error('Failed to load conversations');
  return response.json();
}

export async function createConversation(title?: string): Promise<Conversation> {
  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  if (!response.ok) throw new Error('Failed to create conversation');
  return response.json();
}

export async function listMessagesByConversation(conversationId: string): Promise<Message[]> {
  const response = await fetch(`/api/conversations/${conversationId}/messages`);
  if (!response.ok) throw new Error('Failed to load messages');
  return response.json();
}

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<{ userMessage: Message; assistantMessage: Message }> {
  const response = await fetch(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });

  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
}
