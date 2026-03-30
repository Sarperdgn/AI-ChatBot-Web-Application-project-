'use client';

import type { Conversation } from '@/types/chat';

interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
  onSelectConversation: (conversationId: string) => void;
}

export default function ConversationItem({
  conversation,
  active,
  onSelectConversation
}: ConversationItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelectConversation(conversation.id)}
        className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
          active ? 'bg-sky-600 text-white' : 'text-slate-200 hover:bg-slate-800'
        }`}
      >
        <p className="truncate font-medium">{conversation.title}</p>
        <p className="truncate text-xs text-slate-400">{conversation.preview}</p>
      </button>
    </li>
  );
}
