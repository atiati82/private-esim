import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { chat, parseBigMindResponse, BIGMIND_SYSTEM_PROMPT, parsedResponseToPageData, createAiPagesStorage } from '@/ai-cms';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { topic, cluster, outline, language, saveToDatabase } = body as {
      topic: string;
      cluster?: string;
      outline?: string;
      language?: string;
      saveToDatabase?: boolean;
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

Output all blocks: page-metadata, visual-config, html, ai-image-prompt, and image-prompts.
Include all new fields: KEY, PAGE_TYPE, VISUAL_PRIORITY, ANIMATION_IDEAS, HERO_SECTION, CONTENT_SECTIONS, CARDS_BOXES.

Make it suitable for an eSIM e-commerce website focusing on travel connectivity.`;

    const response = await chat([
      { role: 'system', content: BIGMIND_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ]);

    const parsed = parseBigMindResponse(response);
    const pageData = parsedResponseToPageData(parsed);
    
    let savedPage = null;
    if (saveToDatabase) {
      try {
        const payload = await getPayload({ config });
        const locale = (language?.substring(0, 2) as 'en' | 'de' | 'es' | 'fr' | 'pl' | 'ru') || 'en';
        const storage = createAiPagesStorage(payload, locale);
        savedPage = await storage.createPage(pageData);
      } catch (saveError) {
        console.error('[AI Generate API] Error saving to database:', saveError);
      }
    }

    return NextResponse.json({
      raw: response,
      parsed,
      pageData,
      savedPage,
    });
  } catch (error) {
    console.error('[AI Generate API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
