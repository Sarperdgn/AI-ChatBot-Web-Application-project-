import { prisma } from './db';

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
  return prisma.message.create({
    data: {
      role,
      content,
      conversationId
    }
  });
}

export async function deleteMessagesByConversation(conversationId: string) {
  return prisma.message.deleteMany({
    where: { conversationId }
  });
}
