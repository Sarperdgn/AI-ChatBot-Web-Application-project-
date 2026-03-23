const conversationsDb = [];

export function listConversations() {
  return Promise.resolve([...conversationsDb]);
}

export function createConversation({ title = 'New Chat' } = {}) {
  const newConversation = {
    id: `conv-${Date.now()}`,
    title,
    preview: 'Start a fresh conversation'
  };
  conversationsDb.unshift(newConversation);
  return Promise.resolve(newConversation);
}
