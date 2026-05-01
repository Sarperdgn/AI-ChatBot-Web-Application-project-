'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Conversation } from '@/types/chat';
import {
  CONVERSATIONS_QUERY_KEY,
  useCreateConversation,
  useDeleteConversation
} from '@/hooks/conversations';
import ConversationList from './ConversationList';
import NewChatButton from './NewChatButton';

interface SidebarClientProps {
  activeConversationId: string;
  initialConversations: Conversation[];
}

export default function SidebarClient({
  activeConversationId,
  initialConversations
}: SidebarClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: conversations = [] } = useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: async () => initialConversations,
    initialData: initialConversations,
    staleTime: Number.POSITIVE_INFINITY
  });

  const createMutation = useCreateConversation();
  const deleteMutation = useDeleteConversation();

  useEffect(() => {
    queryClient.setQueryData(CONVERSATIONS_QUERY_KEY, initialConversations);
  }, [initialConversations, queryClient]);

  const handleCreateChat = () => {
    createMutation.mutate(undefined, {
      onSuccess: (created) => {
        router.push(`/conversations/${created.id}`);
        router.refresh();
      }
    });
  };

  const handleSelectConversation = (conversationId: string) => {
    router.push(`/conversations/${conversationId}`);
  };

  const handleDeleteConversation = (conversationId: string) => {
    deleteMutation.mutate(conversationId, {
      onSuccess: () => {
        if (conversationId === activeConversationId) {
          router.push('/');
        }
        router.refresh();
      }
    });
  };

  return (
    <aside
      className="flex h-full flex-col border-r border-slate-800 bg-slate-900/90 p-3"
      aria-label="Conversations sidebar"
    >
      <NewChatButton onClick={handleCreateChat} disabled={createMutation.isPending} />
      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        deletingId={deleteMutation.isPending ? deleteMutation.variables : undefined}
      />
    </aside>
  );
}
