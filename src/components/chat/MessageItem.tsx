import type { Message } from '@/types/chat';

export default function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <li className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
          isUser ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-100'
        }`}
      >
        {message.content}
      </div>
    </li>
  );
}
