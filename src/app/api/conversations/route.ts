import { NextResponse } from 'next/server';
import { createConversation, listConversations } from '@/app/api/_store';

export async function GET() {
  return NextResponse.json(listConversations());
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { title?: string };
  const conversation = createConversation({ title: body.title });

  return NextResponse.json(conversation, { status: 201 });
}
