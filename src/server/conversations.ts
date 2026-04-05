import { prisma } from './db';

export async function listConversations() {
  return prisma.conversation.findMany({
    orderBy: { updatedAt: 'desc' }
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

export async function getConversation(id: string) {
  return prisma.conversation.findUnique({
    where: { id }
  });
}

export async function deleteConversation(id: string) {
  return prisma.conversation.delete({
    where: { id }
  });
}

export async function updateConversationPreview(id: string, preview: string) {
  return prisma.conversation.update({
    where: { id },
    data: { preview }
  });
}
