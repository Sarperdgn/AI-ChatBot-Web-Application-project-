export default function NewChatButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
    >
      + New Chat
    </button>
  );
}
