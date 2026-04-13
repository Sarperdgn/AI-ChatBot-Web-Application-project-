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
      initialConversations={conversations}
      activeConversationId={activeConversationId}
    />
  );
}
