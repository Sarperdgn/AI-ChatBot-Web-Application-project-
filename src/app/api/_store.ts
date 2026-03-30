import fs from 'fs';
import path from 'path';
import type { Conversation, Message } from '@/types/chat';

const DATA_DIR = path.join(process.cwd(), '.data');
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data from files or initialize empty
const loadConversations = (): Conversation[] => {
  try {
    if (fs.existsSync(CONVERSATIONS_FILE)) {
      return JSON.parse(fs.readFileSync(CONVERSATIONS_FILE, 'utf-8'));
    }
  } catch {
    // Ignore parse errors, return empty
  }
  return [];
};

const loadMessages = (): Record<string, Message[]> => {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    }
  } catch {
    // Ignore parse errors, return empty
  }
  return {};
};

const saveConversations = (data: Conversation[]) => {
  fs.writeFileSync(CONVERSATIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

const saveMessages = (data: Record<string, Message[]>) => {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

let conversationsDb: Conversation[] = loadConversations();
let messagesDb: Record<string, Message[]> = loadMessages();

export function listConversations() {
  return [...conversationsDb];
}

export function createConversation({ title = 'New Chat' }: { title?: string } = {}) {
  const newConversation: Conversation = {
    id: `conv-${Date.now()}`,
    title,
    preview: 'Start a fresh conversation'
  };

  conversationsDb.unshift(newConversation);
  if (!messagesDb[newConversation.id]) {
    messagesDb[newConversation.id] = [];
  }

  saveConversations(conversationsDb);
  saveMessages(messagesDb);

  return newConversation;
}

export function getConversation(conversationId: string) {
  return conversationsDb.find((conversation) => conversation.id === conversationId) || null;
}

export function listMessagesByConversation(conversationId: string) {
  return [...(messagesDb[conversationId] || [])];
}

export function createMessage(conversationId: string, role: Message['role'], content: string) {
  if (!messagesDb[conversationId]) {
    messagesDb[conversationId] = [];
  }

  const nextMessage: Message = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    role,
    content
  };

  messagesDb[conversationId].push(nextMessage);

  const conversation = getConversation(conversationId);
  if (conversation && role === 'user') {
    conversation.preview = content;
    saveConversations(conversationsDb);
  }

  saveMessages(messagesDb);

  return nextMessage;
}
