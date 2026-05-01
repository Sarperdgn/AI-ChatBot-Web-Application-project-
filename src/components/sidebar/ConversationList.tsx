import type { Conversation } from '@/types/chat';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  deletingId?: string;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  deletingId
}: ConversationListProps) {
  if (!conversations.length) {
    return <p className="px-2 text-sm text-slate-400">No conversations yet.</p>;
  }

  return (
    <ul className="space-y-2 overflow-y-auto">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          active={conversation.id === activeConversationId}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={onDeleteConversation}
          isDeleting={deletingId === conversation.id}
        />
      ))}
    </ul>
  );
}
