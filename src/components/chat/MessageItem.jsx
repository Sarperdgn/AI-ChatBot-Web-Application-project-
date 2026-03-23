export default function MessageItem({ message }) {
  const isUser = message.role === 'user';

  return (
    <article className={`max-w-[76%] ${isUser ? 'self-end' : 'self-start'}`}>
      <div
        className={`rounded-xl border px-3 py-2 ${
          isUser
            ? 'border-blue-300/40 bg-blue-500 text-white'
            : 'border-slate-700 bg-slate-800 text-slate-100'
        }`}
      >
        <p className={`mb-1 text-xs ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
          {isUser ? 'You' : 'AI'}
        </p>
        <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p>
      </div>
    </article>
  );
}
