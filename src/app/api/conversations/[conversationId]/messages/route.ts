import { NextResponse } from 'next/server';
import { getConversation } from '@/server/conversations';
import { createMessage, listMessagesByConversation } from '@/server/messages';
import { requestAssistantCompletion } from '@/lib/openRouter';

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

export async function POST(
  request: Request,
  context: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await context.params;
  const conversation = await getConversation(conversationId);

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as { content?: string };

  if (!body.content?.trim()) {
    return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
  }

  const userMessage = await createMessage(conversationId, 'user', body.content.trim());

  try {
    const chatHistory = await listMessagesByConversation(conversationId);
    const assistantReply = await requestAssistantCompletion(chatHistory);
    const assistantMessage = await createMessage(
      conversationId,
      'assistant',
      assistantReply.content
    );

    return NextResponse.json({ userMessage, assistantMessage }, { status: 201 });
  } catch (error) {
    console.error(error);
    const assistantMessage = await createMessage(
      conversationId,
      'assistant',
      'Sorry, I could not reach the AI service right now.'
    );

    return NextResponse.json({ userMessage, assistantMessage }, { status: 201 });
  }
}
