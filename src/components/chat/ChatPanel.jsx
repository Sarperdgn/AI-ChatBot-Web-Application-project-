import ChatHeader from './ChatHeader.jsx';
import LoadingIndicator from './LoadingIndicator.jsx';
import MessageForm from './MessageForm.jsx';
import MessageList from './MessageList.jsx';

export default function ChatPanel({ conversation, messages, isLoading, onSendMessage }) {
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
