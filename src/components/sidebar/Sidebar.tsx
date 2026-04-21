import { listConversations } from '@/server/chat-dal';
import SidebarClient from './SidebarClient';

export default async function Sidebar({
  activeConversationId = ''
}: {
  activeConversationId?: string;
}) {
  const conversations = await listConversations();

  return (
    <SidebarClient
      activeConversationId={activeConversationId}
      initialConversations={conversations.map((conversation) => ({
        id: conversation.id,
        title: conversation.title,
        preview: conversation.preview
      }))}
    />
  );
}
