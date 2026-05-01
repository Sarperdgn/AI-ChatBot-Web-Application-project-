import 'server-only';
import { prisma } from './db';

function previewFromContent(content: string) {
  return content.trim().slice(0, 120) || 'Start a fresh conversation';
}

export async function listConversations() {
  return prisma.conversation.findMany({
    orderBy: { updatedAt: 'desc' }
  });
}

export async function getConversation(conversationId: string) {
  return prisma.conversation.findUnique({
    where: { id: conversationId }
  });
}

export async function getConversationWithMessages(conversationId: string) {
  return prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });
}

export async function createConversation({ title = 'New Chat' }: { title?: string } = {}) {
  return prisma.conversation.create({
    data: {
      title,
      preview: 'Start a fresh conversation'
    }
  });
}

export async function deleteConversation(conversationId: string) {
  return prisma.conversation.delete({
    where: { id: conversationId }
  });
}

export async function listMessagesByConversation(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' }
  });
}

export async function createMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
) {
  return prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: {
        conversationId,
        role,
        content
      }
    });

    await tx.conversation.update({
      where: { id: conversationId },
      data: {
        preview: previewFromContent(content)
      }
    });

    return message;
  });
}
