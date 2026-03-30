import ConversationChat from '@/components/chat/ConversationChat';
import Sidebar from '@/components/sidebar/Sidebar';

export default async function ConversationPage({
  params
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  return (
    <div className="grid h-screen grid-cols-[320px_1fr]">
      <Sidebar />
      <ConversationChat conversationId={conversationId} />
    </div>
  );
}
