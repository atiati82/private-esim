import { NextRequest, NextResponse } from 'next/server';
import { bigmindChat, type ChatMessage } from '@/ai-cms';
import { createPayloadStorage } from '@/ai-cms/services/payload-storage';
import { appGetPayload } from '@/payload/utils/get-payload';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { messages, enableFunctions = true } = body as {
      messages: ChatMessage[];
      enableFunctions?: boolean;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const payload = await appGetPayload();
    const locale = (body.locale as string) || 'en';
    const storage = createPayloadStorage(payload, locale);

    const result = await bigmindChat(messages, storage, {
      enableFunctions,
    });

    return NextResponse.json({
      response: result.response,
      parsed: result.parsed,
      functionCalls: result.functionCalls,
    });
  } catch (error) {
    console.error('[AI Chat API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI chat request' },
      { status: 500 }
    );
  }
}
