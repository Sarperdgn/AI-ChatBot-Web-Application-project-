export default function ConversationItem({ conversation, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={`w-full rounded-xl border p-3 text-left transition ${
        isActive
          ? 'border-blue-400 bg-slate-700/80 ring-2 ring-blue-400/30'
          : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
      }`}
    >
      <p className="text-sm font-bold text-slate-100">{conversation.title}</p>
      <p className="mt-1 text-xs text-slate-400">{conversation.preview}</p>
    </button>
  );
}
