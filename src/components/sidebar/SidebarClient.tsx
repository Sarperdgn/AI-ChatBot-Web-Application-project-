'use client';

import { useOptimistic, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Conversation } from '@/types/chat';
import ConversationList from './ConversationList';
import NewChatButton from './NewChatButton';

interface SidebarClientProps {
  initialConversations: Conversation[];
  activeConversationId: string;
}

export default function SidebarClient({ initialConversations, activeConversationId }: SidebarClientProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [optimisticConversations, setOptimisticConversations] = useOptimistic(
    conversations,
    (current, next: Conversation[]) => next
  );
  const [isCreating, startCreateTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | undefined>();
  const router = useRouter();

  const handleCreateChat = async () => {
    const tempId = `optimistic-${Date.now()}`;
    const optimisticConversation: Conversation = {
      id: tempId,
      title: `New Chat ${optimisticConversations.length + 1}`,
      preview: 'Start a fresh conversation'
    };

    const previousConversations = conversations;
    startCreateTransition(() => {
      setOptimisticConversations([optimisticConversation, ...conversations]);
    });

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: optimisticConversation.title })
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      const created = (await response.json()) as Conversation;
      const nextConversations = [created, ...previousConversations];
      setConversations(nextConversations);
      startCreateTransition(() => {
        setOptimisticConversations(nextConversations);
      });
      router.push(`/conversations/${created.id}`);
      router.refresh();
    } catch {
      setConversations(previousConversations);
      startCreateTransition(() => {
        setOptimisticConversations(previousConversations);
      });
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    router.push(`/conversations/${conversationId}`);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    const previousConversations = conversations;
    const nextConversations = conversations.filter((conversation) => conversation.id !== conversationId);

    setDeletingId(conversationId);
    startCreateTransition(() => {
      setOptimisticConversations(nextConversations);
    });

    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }

      setConversations(nextConversations);
      startCreateTransition(() => {
        setOptimisticConversations(nextConversations);
      });

      if (conversationId === activeConversationId) {
        router.push('/');
      }

      router.refresh();
    } catch {
      setConversations(previousConversations);
      startCreateTransition(() => {
        setOptimisticConversations(previousConversations);
      });
    } finally {
      setDeletingId(undefined);
    }
  };

  return (
    <aside
      className="flex h-full flex-col border-r border-slate-800 bg-slate-900/90 p-3"
      aria-label="Conversations sidebar"
    >
      <NewChatButton onClick={handleCreateChat} disabled={isCreating} />
      <ConversationList
        conversations={optimisticConversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        deletingId={deletingId}
      />
    </aside>
  );
}
