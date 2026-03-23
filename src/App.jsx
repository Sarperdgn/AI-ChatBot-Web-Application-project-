import { useCallback, useEffect, useMemo, useState } from 'react';
import ChatPanel from './components/chat/ChatPanel.jsx';
import Sidebar from './components/sidebar/Sidebar.jsx';
import { createConversation } from './api/conversationsApi.js';
import { requestAssistantCompletion } from './api/llmApi.js';
import { createMessage, listMessagesByConversation } from './api/messagesApi.js';

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId),
    [conversations, activeConversationId]
  );

  const handleConversationsLoaded = useCallback((items) => {
    setConversations(items);
    if (!items.length) return;
    setActiveConversationId((previousId) => previousId || items[0].id);
  }, []);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    listMessagesByConversation(activeConversationId).then(setMessages);
  }, [activeConversationId]);

  const handleCreateChat = useCallback(async () => {
    const created = await createConversation({ title: `New Chat ${conversations.length + 1}` });
    setConversations((previous) => [created, ...previous]);
    setActiveConversationId(created.id);
    setMessages([]);
  }, [conversations.length]);

  const handleSendMessage = useCallback(
    async (content) => {
      if (!activeConversationId) return;

      const createdUserMessage = await createMessage(activeConversationId, {
        role: 'user',
        content
      });
      setMessages((previous) => [...previous, createdUserMessage]);
      setIsLoading(true);

      try {
        const chatHistory = await listMessagesByConversation(activeConversationId);
        const assistantReply = await requestAssistantCompletion(chatHistory);
        const createdAssistantMessage = await createMessage(activeConversationId, assistantReply);
        setMessages((previous) => [...previous, createdAssistantMessage]);
      } catch (error) {
        const errorMessage = await createMessage(activeConversationId, {
          role: 'assistant',
          content: 'Sorry, I could not reach the AI service right now.'
        });
        setMessages((previous) => [...previous, errorMessage]);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [activeConversationId]
  );

  return (
    <div className="grid h-full min-h-screen grid-cols-[320px_1fr]">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onConversationsLoaded={handleConversationsLoaded}
        onCreateChat={handleCreateChat}
      />
      <ChatPanel
        conversation={activeConversation}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
