'use client';

import { useMemo } from 'react';
import ChatPanel from './ChatPanel';
import type { Conversation, Message } from '@/types/chat';
import { useConversations } from '@/hooks/conversations';
import { useMessages, useSendMessage } from '@/hooks/messages';
import { useQueryClient } from '@tanstack/react-query';

export default function ConversationChat({ conversationId }: { conversationId: string }) {
  const { data: conversations = [] } = useConversations();
  const { data: messages = [], isLoading: isMessagesLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage();
  const queryClient = useQueryClient();

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === conversationId) || null,
    [conversations, conversationId]
  );

  const handleSendMessage = async (content: string) => {
    if (!conversationId) return;

    // Optimistic update
    const optimisticMessage: Message = {
      id: `local-${Date.now()}`,
      role: 'user',
      content
    };

    queryClient.setQueryData(['messages', conversationId], (old: Message[] = []) => [
      ...old,
      optimisticMessage
    ]);

    try {
      await sendMessage.mutateAsync({ conversationId, content });
    } catch {
      // Revert optimistic update on error
      queryClient.setQueryData(['messages', conversationId], (old: Message[] = []) =>
        old.filter((msg) => msg.id !== optimisticMessage.id)
      );
      queryClient.setQueryData(['messages', conversationId], (old: Message[] = []) => [
        ...old,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I could not send that message. Please try again.'
        }
      ]);
    }
  };

  return (
    <ChatPanel
      conversation={activeConversation}
      messages={messages}
      isLoading={isMessagesLoading || sendMessage.isPending}
      onSendMessage={handleSendMessage}
    />
  );
}
