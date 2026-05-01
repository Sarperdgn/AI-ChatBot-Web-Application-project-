import { NextResponse } from 'next/server';
import { getConversation, listMessagesByConversation } from '@/server/chat-dal';

export async function GET(
  _request: Request,
  context: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await context.params;

  const conversation = await getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }

  const messages = await listMessagesByConversation(conversationId);
  return NextResponse.json(messages);
}
