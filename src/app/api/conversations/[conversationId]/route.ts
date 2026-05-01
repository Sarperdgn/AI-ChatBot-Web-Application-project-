import { NextResponse } from 'next/server';
import { deleteConversation, getConversation } from '@/server/chat-dal';

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await context.params;

  const conversation = await getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }

  await deleteConversation(conversationId);
  return NextResponse.json({ success: true });
}
