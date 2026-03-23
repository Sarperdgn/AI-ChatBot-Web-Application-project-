export default function ChatHeader({ title, subtitle }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/70 px-5 py-4">
      <h1 className="text-base font-extrabold text-slate-100">{title}</h1>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </header>
  );
}
