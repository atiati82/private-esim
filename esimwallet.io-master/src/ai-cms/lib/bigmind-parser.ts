export interface ParsedBigMindResponse {
  pageMetadata: {
    title?: string;
    key?: string;
    h1Title?: string;
    path?: string;
    urlSlug?: string;
    cluster?: string;
    pageType?: string;
    template?: string;
    priority?: string;
    summary?: string;
    metaTitle?: string;
    metaDescription?: string;
    seoFocusKeyword?: string;
    seoKeywords?: string[];
    featuredImageUrl?: string;
    pageIcon?: string;
  };
  visualConfig: {
    visualPriority?: string;
    vibeKeywords?: string[];
    emotionalTone?: string[];
    animationIdeas?: string[];
    colorPalette?: string;
    layoutsDetected?: string[];
    motionPreset?: string;
    entranceMotion?: string;
    hoverMotion?: string;
    ambientMotion?: string;
    heroSectionMotion?: string;
    contentSectionsMotion?: string;
    cardsBoxesMotion?: string;
  };
  htmlContent?: string;
  aiImagePrompt?: string;
  aiVideoPrompt?: string;
  designerNotes?: string;
  imagePrompts: Array<{
    id: string;
    slotKey: string;
    slotType: 'hero' | 'featured' | 'section' | 'icon' | 'gallery' | 'background' | 'custom';
    prompt: string;
    location: string;
  }>;
  atmosphere?: string;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function cleanAIResponse(content: string): string {
  let cleaned = content;
  cleaned = decodeHtmlEntities(cleaned);
  cleaned = cleaned.replace(/^```(?:html|tsx|jsx)?\n?/i, '').replace(/\n?```$/i, '');
  cleaned = cleaned.replace(/``<code[^>]*>\s*([a-z-]+)/gi, '```$1');
  cleaned = cleaned.replace(/<\/code>\s*<\/pre>\s*([a-z-]+)/gi, '```$1');
  return cleaned;
}

export function parseBigMindResponse(rawContent: string): ParsedBigMindResponse {
  const content = cleanAIResponse(rawContent);

  const result: ParsedBigMindResponse = {
    pageMetadata: {},
    visualConfig: {},
    imagePrompts: [],
  };

  const pageMetadataMatch = content.match(/```page-metadata\n([\s\S]*?)```/);
  if (pageMetadataMatch) {
    const metaText = pageMetadataMatch[1];

    const titleMatch = metaText.match(/^TITLE:\s*(.+)/im);
    if (titleMatch) {
      result.pageMetadata.title = titleMatch[1].trim();
    }

    const h1Match = metaText.match(/H1_TITLE:\s*(.+)/i);
    if (h1Match) {
      result.pageMetadata.h1Title = h1Match[1].trim();
    }

    const pathMatch = metaText.match(/PATH:\s*(.+)/i);
    if (pathMatch) {
      result.pageMetadata.path = pathMatch[1].trim();
      result.pageMetadata.urlSlug = pathMatch[1].trim().replace(/^\//, '');
    }

    const clusterMatch = metaText.match(/CLUSTER:\s*(.+)/i);
    if (clusterMatch) {
      result.pageMetadata.cluster = clusterMatch[1].trim();
    }

    const seoTitleMatch = metaText.match(/SEO_TITLE:\s*(.+)/i);
    if (seoTitleMatch) {
      result.pageMetadata.metaTitle = seoTitleMatch[1].trim();
    }

    const seoDescMatch = metaText.match(/SEO_DESCRIPTION:\s*(.+)/i);
    if (seoDescMatch) {
      result.pageMetadata.metaDescription = seoDescMatch[1].trim();
    }

    const templateMatch = metaText.match(/TEMPLATE:\s*(.+)/i);
    if (templateMatch) {
      result.pageMetadata.template = templateMatch[1].trim();
    }

    const priorityMatch = metaText.match(/PRIORITY:\s*(.+)/i);
    if (priorityMatch) {
      result.pageMetadata.priority = priorityMatch[1].trim();
    }

    const summaryMatch = metaText.match(/SUMMARY:\s*(.+)/i);
    if (summaryMatch) {
      result.pageMetadata.summary = summaryMatch[1].trim();
    }

    const keyMatch = metaText.match(/KEY:\s*(.+)/i);
    if (keyMatch) {
      result.pageMetadata.key = keyMatch[1].trim();
    }

    const pageTypeMatch = metaText.match(/PAGE_TYPE:\s*(.+)/i);
    if (pageTypeMatch) {
      result.pageMetadata.pageType = pageTypeMatch[1].trim();
    }

    const seoFocusMatch = metaText.match(/SEO_FOCUS(?:_KEYWORD)?:\s*(.+)/i);
    if (seoFocusMatch) {
      result.pageMetadata.seoFocusKeyword = seoFocusMatch[1].trim();
    }

    const featuredImgMatch = metaText.match(/FEATURED_IMAGE(?:_URL)?:\s*(.+)/i);
    if (featuredImgMatch) {
      result.pageMetadata.featuredImageUrl = featuredImgMatch[1].trim();
    }

    const iconMatch = metaText.match(/PAGE_ICON:\s*(.+)/i);
    if (iconMatch) {
      result.pageMetadata.pageIcon = iconMatch[1].trim();
    }
  }

  const visualConfigMatch = content.match(/```visual-config\n([\s\S]*?)```/);
  if (visualConfigMatch) {
    const configText = visualConfigMatch[1];

    const vibeMatch = configText.match(/VIBE KEYWORDS:\s*\[?([^\]\n]+)\]?/i);
    if (vibeMatch) {
      result.visualConfig.vibeKeywords = vibeMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const toneMatch = configText.match(/EMOTIONAL TONE:\s*\[?([^\]\n]+)\]?/i);
    if (toneMatch) {
      result.visualConfig.emotionalTone = toneMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const colorMatch = configText.match(/COLOR PALETTE:\s*([^\n]+)/i);
    if (colorMatch) {
      result.visualConfig.colorPalette = colorMatch[1].trim();
    }

    const motionMatch = configText.match(/MOTION PRESET:\s*([^\n]+)/i);
    if (motionMatch) {
      result.visualConfig.motionPreset = motionMatch[1].trim();
    }

    const entranceMatch = configText.match(/ENTRANCE:\s*([^\n]+)/i);
    if (entranceMatch) {
      result.visualConfig.entranceMotion = entranceMatch[1].trim();
    }

    const hoverMatch = configText.match(/HOVER:\s*([^\n]+)/i);
    if (hoverMatch) {
      result.visualConfig.hoverMotion = hoverMatch[1].trim();
    }

    const ambientMatch = configText.match(/AMBIENT:\s*([^\n]+)/i);
    if (ambientMatch) {
      result.visualConfig.ambientMotion = ambientMatch[1].trim();
    }

    const visualPriorityMatch = configText.match(/VISUAL_PRIORITY:\s*([^\n]+)/i);
    if (visualPriorityMatch) {
      result.visualConfig.visualPriority = visualPriorityMatch[1].trim();
    }

    const animationIdeasMatch = configText.match(/ANIMATION_IDEAS:\s*\[?([^\]\n]+)\]?/i);
    if (animationIdeasMatch) {
      result.visualConfig.animationIdeas = animationIdeasMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const heroMotionMatch = configText.match(/HERO_SECTION:\s*([^\n]+)/i);
    if (heroMotionMatch) {
      result.visualConfig.heroSectionMotion = heroMotionMatch[1].trim();
    }

    const contentMotionMatch = configText.match(/CONTENT_SECTIONS:\s*([^\n]+)/i);
    if (contentMotionMatch) {
      result.visualConfig.contentSectionsMotion = contentMotionMatch[1].trim();
    }

    const cardsMotionMatch = configText.match(/CARDS_BOXES:\s*([^\n]+)/i);
    if (cardsMotionMatch) {
      result.visualConfig.cardsBoxesMotion = cardsMotionMatch[1].trim();
    }
  }

  const htmlMatch =
    content.match(/```html\n([\s\S]*?)```/) ||
    content.match(/```tsx\n([\s\S]*?)```/) ||
    content.match(/```page-html\n([\s\S]*?)```/);
  if (htmlMatch) {
    result.htmlContent = decodeHtmlEntities(htmlMatch[1].trim());
  }

  if (result.htmlContent) {
    const aiPromptRegex = /<!--\s*AI LAYOUT PROMPT:\s*([^>]+)-->/gi;
    let match;
    let idx = 0;
    while ((match = aiPromptRegex.exec(result.htmlContent)) !== null) {
      idx++;
      result.imagePrompts.push({
        id: `img-${idx}-${Date.now()}`,
        slotKey: `slot-${idx}`,
        slotType: detectSlotType(match[1], idx),
        prompt: match[1].trim(),
        location: `Section ${idx}`,
      });
    }
  }

  const imagePromptsMatch = content.match(/```image-prompts\n([\s\S]*?)```/);
  if (imagePromptsMatch) {
    const lines = imagePromptsMatch[1].split('\n');
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const label = line.substring(0, colonIdx).trim();
        const prompt = line.substring(colonIdx + 1).trim();
        result.imagePrompts.push({
          id: `imgblock-${result.imagePrompts.length + 1}`,
          slotKey: label.toLowerCase().replace(/\s+/g, '-'),
          slotType: detectSlotTypeFromLabel(label),
          prompt,
          location: label,
        });
      }
    }
  }

  const aiImagePromptMatch = content.match(/```ai-image-prompt\n([\s\S]*?)```/);
  if (aiImagePromptMatch) {
    result.aiImagePrompt = aiImagePromptMatch[1].trim();
  }

  const aiVideoPromptMatch = content.match(/```ai-video-prompt\n([\s\S]*?)```/);
  if (aiVideoPromptMatch) {
    result.aiVideoPrompt = aiVideoPromptMatch[1].trim();
  }

  const designerNotesMatch = content.match(/```designer-notes\n([\s\S]*?)```/);
  if (designerNotesMatch) {
    result.designerNotes = designerNotesMatch[1].trim();
  }

  return result;
}

function detectSlotType(
  prompt: string,
  index: number,
): ParsedBigMindResponse['imagePrompts'][0]['slotType'] {
  const lower = prompt.toLowerCase();
  if (lower.includes('hero') || index === 1) {
    return 'hero';
  }
  if (lower.includes('featured')) {
    return 'featured';
  }
  if (lower.includes('icon')) {
    return 'icon';
  }
  if (lower.includes('gallery')) {
    return 'gallery';
  }
  if (lower.includes('background')) {
    return 'background';
  }
  return 'section';
}

function detectSlotTypeFromLabel(
  label: string,
): ParsedBigMindResponse['imagePrompts'][0]['slotType'] {
  const lower = label.toLowerCase();
  if (lower.includes('hero')) {
    return 'hero';
  }
  if (lower.includes('featured')) {
    return 'featured';
  }
  if (lower.includes('icon')) {
    return 'icon';
  }
  if (lower.includes('gallery')) {
    return 'gallery';
  }
  if (lower.includes('background')) {
    return 'background';
  }
  return 'section';
}

export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}
