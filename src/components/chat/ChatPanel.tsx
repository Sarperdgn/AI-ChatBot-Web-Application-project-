import type { Conversation, Message } from '@/types/chat';
import ChatHeader from './ChatHeader';
import LoadingIndicator from './LoadingIndicator';
import MessageForm from './MessageForm';
import MessageList from './MessageList';

interface ChatPanelProps {
  conversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => Promise<void>;
}

export default function ChatPanel({
  conversation,
  messages,
  isLoading,
  onSendMessage
}: ChatPanelProps) {
  return (
    <main className="grid h-full grid-rows-[auto_1fr_auto] bg-slate-900/40" aria-label="Chat area">
      <ChatHeader
        title={conversation?.title || 'New Chat'}
        subtitle={conversation?.preview || 'Start a fresh conversation'}
      />
      <MessageList messages={messages} />
      <div>
        {isLoading ? <LoadingIndicator /> : null}
        <MessageForm onSendMessage={onSendMessage} disabled={isLoading || !conversation} />
      </div>
    </main>
  );
}
