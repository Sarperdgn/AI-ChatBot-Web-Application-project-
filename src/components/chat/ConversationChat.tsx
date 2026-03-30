'use client';

import { useEffect, useMemo, useState } from 'react';
import ChatPanel from './ChatPanel';
import type { Conversation, Message } from '@/types/chat';
import { listConversations, listMessagesByConversation, sendMessage } from '@/lib/clientApi';

export default function ConversationChat({ conversationId }: { conversationId: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === conversationId) || null,
    [conversations, conversationId]
  );

  useEffect(() => {
    listConversations().then(setConversations);
  }, []);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    listMessagesByConversation(conversationId).then(setMessages);
  }, [conversationId]);

  const handleSendMessage = async (content: string) => {
    if (!conversationId) return;

    const optimisticMessage: Message = {
      id: `local-${Date.now()}`,
      role: 'user',
      content
    };

    setMessages((previous) => [...previous, optimisticMessage]);
    setIsLoading(true);

    try {
      const { userMessage, assistantMessage } = await sendMessage(conversationId, content);

      setMessages((previous) => [
        ...previous.filter((message) => message.id !== optimisticMessage.id),
        userMessage,
        assistantMessage
      ]);

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId ? { ...conversation, preview: content } : conversation
        )
      );
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I could not send that message. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatPanel
      conversation={activeConversation}
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
    />
  );
}
