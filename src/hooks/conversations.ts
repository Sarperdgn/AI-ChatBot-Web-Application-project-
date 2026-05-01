import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Conversation } from '@/types/chat';

export const CONVERSATIONS_QUERY_KEY = ['conversations'] as const;

async function createConversationApi(title?: string): Promise<Conversation> {
  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }

  return response.json();
}

async function deleteConversationApi(id: string): Promise<void> {
  const response = await fetch(`/api/conversations/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Failed to delete conversation');
  }
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversationApi,
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
      const previous = queryClient.getQueryData<Conversation[]>(CONVERSATIONS_QUERY_KEY) ?? [];
      const optimisticId = `optimistic-${Date.now()}`;

      const optimisticConversation: Conversation = {
        id: optimisticId,
        title: title || `New Chat ${previous.length + 1}`,
        preview: 'Start a fresh conversation'
      };

      queryClient.setQueryData<Conversation[]>(CONVERSATIONS_QUERY_KEY, [
        optimisticConversation,
        ...previous
      ]);

      return { previous, optimisticId };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(CONVERSATIONS_QUERY_KEY, context?.previous ?? []);
    },
    onSuccess: (created, _variables, context) => {
      queryClient.setQueryData<Conversation[]>(CONVERSATIONS_QUERY_KEY, (current = []) => {
        return [
          created,
          ...current.filter(
            (conversation) =>
              conversation.id !== context?.optimisticId && conversation.id !== created.id
          )
        ];
      });
    }
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConversationApi,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
      const previous = queryClient.getQueryData<Conversation[]>(CONVERSATIONS_QUERY_KEY) ?? [];

      queryClient.setQueryData<Conversation[]>(
        CONVERSATIONS_QUERY_KEY,
        previous.filter((conversation) => conversation.id !== id)
      );

      return { previous };
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(CONVERSATIONS_QUERY_KEY, context?.previous ?? []);
    }
  });
}
