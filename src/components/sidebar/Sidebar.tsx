'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Conversation } from '@/types/chat';
import { createConversation, listConversations } from '@/lib/clientApi';
import ConversationList from './ConversationList';
import NewChatButton from './NewChatButton';

export default function Sidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const activeConversationId = pathname?.startsWith('/conversations/')
    ? pathname.replace('/conversations/', '')
    : '';

  useEffect(() => {
    listConversations().then((items) => {
      setConversations(items);
    });
  }, []);

  const handleCreateChat = async () => {
    const created = await createConversation(`New Chat ${conversations.length + 1}`);
    setConversations((previous) => [created, ...previous]);
    router.push(`/conversations/${created.id}`);
  };

  const handleSelectConversation = (conversationId: string) => {
    router.push(`/conversations/${conversationId}`);
  };

  return (
    <aside
      className="flex h-full flex-col border-r border-slate-800 bg-slate-900/90 p-3"
      aria-label="Conversations sidebar"
    >
      <NewChatButton onClick={handleCreateChat} />
      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
      />
    </aside>
  );
}
