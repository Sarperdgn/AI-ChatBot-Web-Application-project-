import 'server-only';
import { ensureDatabaseReady, prisma } from './db';

function previewFromContent(content: string) {
  return content.trim().slice(0, 120) || 'Start a fresh conversation';
}

export async function listConversations() {
  await ensureDatabaseReady();

  return prisma.conversation.findMany({
    orderBy: { updatedAt: 'desc' }
  });
}

export async function getConversation(conversationId: string) {
  await ensureDatabaseReady();

  return prisma.conversation.findUnique({
    where: { id: conversationId }
  });
}

export async function getConversationWithMessages(conversationId: string) {
  await ensureDatabaseReady();

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
  await ensureDatabaseReady();

  return prisma.conversation.create({
    data: {
      title,
      preview: 'Start a fresh conversation'
    }
  });
}

export async function deleteConversation(conversationId: string) {
  await ensureDatabaseReady();

  return prisma.conversation.delete({
    where: { id: conversationId }
  });
}

export async function listMessagesByConversation(conversationId: string) {
  await ensureDatabaseReady();

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
  await ensureDatabaseReady();

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
