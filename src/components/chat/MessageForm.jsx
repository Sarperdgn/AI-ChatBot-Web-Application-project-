import { useState } from 'react';

export default function MessageForm({ onSendMessage, disabled }) {
  const [draft, setDraft] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const cleaned = draft.trim();
    if (!cleaned || disabled) return;

    setDraft('');
    await onSendMessage(cleaned);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-[1fr_auto] gap-3 border-t border-slate-800 bg-slate-950/80 p-4"
    >
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Write a message..."
        rows={2}
        className="resize-none rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-blue-400/40 placeholder:text-slate-500 focus:ring"
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
