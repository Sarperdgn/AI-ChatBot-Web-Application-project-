import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Conversation } from '@/types/chat';

const CONVERSATIONS_KEY = 'conversations';

async function fetchConversations(): Promise<Conversation[]> {
  const response = await fetch('/api/conversations');
  if (!response.ok) throw new Error('Failed to load conversations');
  return response.json();
}

async function createConversation(title?: string): Promise<Conversation> {
  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!response.ok) throw new Error('Failed to create conversation');
  return response.json();
}

async function deleteConversationApi(id: string): Promise<void> {
  const response = await fetch(`/api/conversations/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete conversation');
}

export function useConversations() {
  return useQuery({
    queryKey: [CONVERSATIONS_KEY],
    queryFn: fetchConversations
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY] });
    }
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConversationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY] });
    }
  });
}
