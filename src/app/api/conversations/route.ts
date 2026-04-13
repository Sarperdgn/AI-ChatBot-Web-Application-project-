import { NextResponse } from 'next/server';
import { createConversation, listConversations } from '@/server/chat-dal';

export async function GET() {
  const conversations = await listConversations();
  return NextResponse.json(conversations);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { title?: string };
  const conversation = await createConversation({ title: body.title });

  return NextResponse.json(conversation, { status: 201 });
}
