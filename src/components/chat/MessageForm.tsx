'use client';

import { FormEvent, useState } from 'react';

interface MessageFormProps {
  onSendMessage: (content: string) => Promise<void>;
  disabled: boolean;
}

export default function MessageForm({ onSendMessage, disabled }: MessageFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || disabled) return;

    setContent('');
    await onSendMessage(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-800 px-6 py-4">
      <div className="flex gap-2">
        <input
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={disabled}
          placeholder="Type your message"
          className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </form>
  );
}
