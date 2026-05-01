import ConversationChat from '@/components/chat/ConversationChat';
import Sidebar from '@/components/sidebar/Sidebar';
import { getConversationWithMessages } from '@/server/chat-dal';
import { notFound } from 'next/navigation';

export default async function ConversationPage({
  params
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const conversation = await getConversationWithMessages(conversationId);

  if (!conversation) {
    notFound();
  }

  return (
    <div className="grid h-screen grid-cols-[320px_1fr]">
      <Sidebar activeConversationId={conversationId} />
      <ConversationChat
        conversationId={conversationId}
        conversation={{
          id: conversation.id,
          title: conversation.title,
          preview: conversation.preview
        }}
        initialMessages={conversation.messages.map((message) => ({
          id: message.id,
          role: message.role as 'user' | 'assistant',
          content: message.content
        }))}
      />
    </div>
  );
}
