'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  useConversations,
  useCreateConversation,
  useDeleteConversation
} from '@/hooks/conversations';
import ConversationList from './ConversationList';
import NewChatButton from './NewChatButton';

export default function Sidebar() {
  const { data: conversations = [], isLoading } = useConversations();
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();
  const router = useRouter();
  const pathname = usePathname();
  const activeConversationId = pathname?.startsWith('/conversations/')
    ? pathname.replace('/conversations/', '')
    : '';

  const handleCreateChat = async () => {
    const created = await createConversation.mutateAsync(`New Chat ${conversations.length + 1}`);
    router.push(`/conversations/${created.id}`);
  };

  const handleSelectConversation = (conversationId: string) => {
    router.push(`/conversations/${conversationId}`);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    await deleteConversation.mutateAsync(conversationId);
    // Navigate to home if deleting the active conversation
    if (conversationId === activeConversationId) {
      router.push('/');
    }
  };

  return (
    <aside
      className="flex h-full flex-col border-r border-slate-800 bg-slate-900/90 p-3"
      aria-label="Conversations sidebar"
    >
      <NewChatButton onClick={handleCreateChat} disabled={createConversation.isPending} />
      {isLoading ? (
        <div className="mt-4 text-sm text-slate-400">Loading...</div>
      ) : (
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          deletingId={deleteConversation.isPending ? deleteConversation.variables : undefined}
        />
      )}
    </aside>
  );
}
