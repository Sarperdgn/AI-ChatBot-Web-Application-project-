import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { NextResponse } from 'next/server';
import { createMessage, getConversation } from '@/server/chat-dal';

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Next Chat UI'
  }
});

export async function POST(
  request: Request,
  context: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await context.params;
  const conversation = await getConversation(conversationId);

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as { messages?: UIMessage[] };
  const messages = body.messages ?? [];

  const lastMessage = messages.at(-1);
  const userMessage = lastMessage?.parts
    ?.filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
    .trim();

  if (!userMessage) {
    return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
  }

  await createMessage(conversationId, 'user', userMessage);

  if (!process.env.OPENROUTER_API_KEY) {
    const fallback =
      'Mock reply: add OPENROUTER_API_KEY to stream real model responses from OpenRouter.';
    await createMessage(conversationId, 'assistant', fallback);

    return new Response(fallback, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openrouter('openrouter/auto'),
    messages: modelMessages,
    onFinish: async ({ text }) => {
      if (text.trim()) {
        await createMessage(conversationId, 'assistant', text.trim());
      }
    }
  });

  return result.toUIMessageStreamResponse();
}
