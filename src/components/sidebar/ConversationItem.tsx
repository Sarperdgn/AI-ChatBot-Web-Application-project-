'use client';

import type { Conversation } from '@/types/chat';

interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  isDeleting?: boolean;
}

export default function ConversationItem({
  conversation,
  active,
  onSelectConversation,
  onDeleteConversation,
  isDeleting
}: ConversationItemProps) {
  return (
    <li className="group relative">
      <button
        type="button"
        onClick={() => onSelectConversation(conversation.id)}
        disabled={isDeleting}
        className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
          active ? 'bg-sky-600 text-white' : 'text-slate-200 hover:bg-slate-800'
        } ${isDeleting ? 'opacity-50' : ''}`}
      >
        <p className="truncate font-medium">{conversation.title}</p>
        <p className={`truncate text-xs ${active ? 'text-sky-200' : 'text-slate-400'}`}>
          {conversation.preview}
        </p>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteConversation(conversation.id);
        }}
        disabled={isDeleting}
        className={`absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-xs opacity-0 transition hover:bg-red-600 hover:text-white group-hover:opacity-100 ${
          active ? 'text-white hover:text-white' : 'text-slate-400'
        } ${isDeleting ? 'opacity-50' : ''}`}
        aria-label="Delete conversation"
      >
        ×
      </button>
    </li>
  );
}
