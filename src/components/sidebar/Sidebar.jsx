import { useEffect } from 'react';
import { listConversations } from '../../api/conversationsApi.js';
import ConversationList from './ConversationList.jsx';
import NewChatButton from './NewChatButton.jsx';

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onConversationsLoaded,
  onCreateChat
}) {
  useEffect(() => {
    listConversations().then(onConversationsLoaded);
  }, [onConversationsLoaded]);

  return (
    <aside
      className="flex h-full flex-col border-r border-slate-800 bg-slate-900/90 p-3"
      aria-label="Conversations sidebar"
    >
      <NewChatButton onClick={onCreateChat} />
      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
      />
    </aside>
  );
}
