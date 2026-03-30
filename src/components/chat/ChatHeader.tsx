interface ChatHeaderProps {
  title: string;
  subtitle: string;
}

export default function ChatHeader({ title, subtitle }: ChatHeaderProps) {
  return (
    <header className="border-b border-slate-800 px-6 py-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-sm text-slate-400">{subtitle}</p>
    </header>
  );
}
