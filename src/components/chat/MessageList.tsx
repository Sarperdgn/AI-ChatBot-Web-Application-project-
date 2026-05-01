import type { Message } from '@/types/chat';
import MessageItem from './MessageItem';

export default function MessageList({ messages }: { messages: Message[] }) {
  if (!messages.length) {
    return <p className="px-6 py-8 text-sm text-slate-400">No messages yet.</p>;
  }

  return (
    <ul className="space-y-4 overflow-y-auto px-6 py-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </ul>
  );
}
