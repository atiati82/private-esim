import { NextRequest, NextResponse } from 'next/server';
import { chat, parseBigMindResponse, BIGMIND_SYSTEM_PROMPT } from '@/ai-cms';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { topic, cluster, outline, language } = body as {
      topic: string;
      cluster?: string;
      outline?: string;
      language?: string;
    };

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const prompt = `Generate a complete page for "${topic}"${cluster ? ` in the ${cluster} cluster` : ''}.
${outline ? `Key points to cover: ${outline}` : ''}
${language ? `Write content in ${language} language.` : ''}

Output all four blocks: page-metadata, visual-config, html, and image-prompts.

Make it suitable for an eSIM e-commerce website focusing on travel connectivity.`;

    const response = await chat([
      { role: 'system', content: BIGMIND_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ]);

    const parsed = parseBigMindResponse(response);

    return NextResponse.json({
      raw: response,
      parsed,
    });
  } catch (error) {
    console.error('[AI Generate API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
