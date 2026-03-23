export default function LoadingIndicator() {
  return (
    <div className="px-5 pb-2">
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">
        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
        AI is typing...
      </div>
    </div>
  );
}
