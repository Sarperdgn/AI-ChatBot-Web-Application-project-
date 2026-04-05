import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Message } from '@/types/chat';

const MESSAGES_KEY = 'messages';

function getMessagesKey(conversationId: string) {
  return [MESSAGES_KEY, conversationId];
}

async function fetchMessages(conversationId: string): Promise<Message[]> {
  const response = await fetch(`/api/conversations/${conversationId}/messages`);
  if (!response.ok) throw new Error('Failed to load messages');
  return response.json();
}

async function sendMessage(
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

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: getMessagesKey(conversationId),
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      sendMessage(conversationId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getMessagesKey(variables.conversationId) });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
}
