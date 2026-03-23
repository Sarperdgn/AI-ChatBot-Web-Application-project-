const messagesDb = {};

export function listMessagesByConversation(conversationId) {
  return Promise.resolve([...(messagesDb[conversationId] || [])]);
}

export function createMessage(conversationId, { role, content }) {
  const nextMessage = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    role,
    content
  };

  if (!messagesDb[conversationId]) {
    messagesDb[conversationId] = [];
  }

  messagesDb[conversationId].push(nextMessage);
  return Promise.resolve(nextMessage);
}
