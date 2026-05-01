'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { Conversation, Message } from '@/types/chat';
import ChatPanel from './ChatPanel';

interface ConversationChatProps {
  conversationId: string;
  conversation: Conversation;
  initialMessages: Message[];
}

export default function ConversationChat({
  conversationId,
  conversation,
  initialMessages
}: ConversationChatProps) {
  const router = useRouter();

  const { messages, status, sendMessage } = useChat({
    id: conversationId,
    messages: initialMessages.map((message) => ({
      id: message.id,
      role: message.role,
      parts: [{ type: 'text', text: message.content }]
    })),
    transport: new DefaultChatTransport({
      api: `/api/conversations/${conversationId}/stream`
    }),
    onFinish: () => {
      router.refresh();
    }
  });

  const mappedMessages = useMemo<Message[]>(
    () =>
      messages.map((message) => ({
        id: message.id,
        role: message.role as 'user' | 'assistant',
        content: message.parts
          .filter((part) => part.type === 'text')
          .map((part) => part.text)
          .join('')
      })),
    [messages]
  );

  const handleSendMessage = async (content: string) => {
    await sendMessage({ text: content }, { body: { conversationId } });
  };

  return (
    <ChatPanel
      conversation={conversation}
      messages={mappedMessages}
      isLoading={status === 'streaming' || status === 'submitted'}
      onSendMessage={handleSendMessage}
    />
  );
}
