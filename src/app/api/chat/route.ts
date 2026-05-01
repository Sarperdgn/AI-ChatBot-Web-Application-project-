import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { NextResponse } from 'next/server';

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Next Chat UI'
  }
});

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { messages?: UIMessage[] };
  const messages = body.messages ?? [];

  const hasUserText = messages.some(
    (message) =>
      message.role === 'user' &&
      message.parts?.some((part) => part.type === 'text' && part.text.trim().length > 0)
  );

  if (!hasUserText) {
    return NextResponse.json({ error: 'At least one user message is required.' }, { status: 400 });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    const fallback =
      'Mock reply: add OPENROUTER_API_KEY to stream real model responses from OpenRouter.';

    return new Response(fallback, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openrouter('openrouter/auto'),
    messages: modelMessages
  });

  return result.toUIMessageStreamResponse();
}
