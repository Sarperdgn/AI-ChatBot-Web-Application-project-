import Sidebar from '@/components/sidebar/Sidebar';

export default function HomePage() {
  return (
    <div className="grid h-screen grid-cols-[320px_1fr]">
      <Sidebar />
      <main className="flex items-center justify-center bg-slate-900/40">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Welcome to Chat UI</h1>
          <p className="mt-2 text-sm text-slate-400">
            Create or open a conversation from the sidebar to begin chatting.
          </p>
        </div>
      </main>
    </div>
  );
}
