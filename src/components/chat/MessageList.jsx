import { useEffect, useRef } from 'react';
import MessageItem from './MessageItem.jsx';

export default function MessageList({ messages }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <section
      ref={containerRef}
      className="flex flex-1 flex-col gap-3 overflow-y-auto p-5"
      aria-label="Message list"
    >
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </section>
  );
}
