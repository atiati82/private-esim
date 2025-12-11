export interface ParsedBigMindResponse {
  pageMetadata: {
    title?: string;
    h1Title?: string;
    path?: string;
    urlSlug?: string;
    cluster?: string;
    metaTitle?: string;
    metaDescription?: string;
    seoFocus?: string;
    seoKeywords?: string[];
    template?: string;
    priority?: string;
    summary?: string;
  };
  visualConfig: {
    vibeKeywords?: string[];
    emotionalTone?: string[];
    colorPalette?: string;
    layoutsDetected?: string[];
    motionPreset?: string;
    entranceMotion?: string;
    hoverMotion?: string;
    ambientMotion?: string;
  };
  htmlContent?: string;
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
    if (titleMatch) result.pageMetadata.title = titleMatch[1].trim();
    
    const h1Match = metaText.match(/H1_TITLE:\s*(.+)/i);
    if (h1Match) result.pageMetadata.h1Title = h1Match[1].trim();
    
    const pathMatch = metaText.match(/PATH:\s*(.+)/i);
    if (pathMatch) {
      result.pageMetadata.path = pathMatch[1].trim();
      result.pageMetadata.urlSlug = pathMatch[1].trim().replace(/^\//, '');
    }
    
    const clusterMatch = metaText.match(/CLUSTER:\s*(.+)/i);
    if (clusterMatch) result.pageMetadata.cluster = clusterMatch[1].trim();
    
    const seoTitleMatch = metaText.match(/SEO_TITLE:\s*(.+)/i);
    if (seoTitleMatch) result.pageMetadata.metaTitle = seoTitleMatch[1].trim();
    
    const seoDescMatch = metaText.match(/SEO_DESCRIPTION:\s*(.+)/i);
    if (seoDescMatch) result.pageMetadata.metaDescription = seoDescMatch[1].trim();
    
    const templateMatch = metaText.match(/TEMPLATE:\s*(.+)/i);
    if (templateMatch) result.pageMetadata.template = templateMatch[1].trim();
    
    const priorityMatch = metaText.match(/PRIORITY:\s*(.+)/i);
    if (priorityMatch) result.pageMetadata.priority = priorityMatch[1].trim();
    
    const summaryMatch = metaText.match(/SUMMARY:\s*(.+)/i);
    if (summaryMatch) result.pageMetadata.summary = summaryMatch[1].trim();
  }

  const visualConfigMatch = content.match(/```visual-config\n([\s\S]*?)```/);
  if (visualConfigMatch) {
    const configText = visualConfigMatch[1];
    
    const vibeMatch = configText.match(/VIBE KEYWORDS:\s*\[?([^\]\n]+)\]?/i);
    if (vibeMatch) {
      result.visualConfig.vibeKeywords = vibeMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    }
    
    const toneMatch = configText.match(/EMOTIONAL TONE:\s*\[?([^\]\n]+)\]?/i);
    if (toneMatch) {
      result.visualConfig.emotionalTone = toneMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    }
    
    const colorMatch = configText.match(/COLOR PALETTE:\s*([^\n]+)/i);
    if (colorMatch) result.visualConfig.colorPalette = colorMatch[1].trim();
    
    const motionMatch = configText.match(/MOTION PRESET:\s*([^\n]+)/i);
    if (motionMatch) result.visualConfig.motionPreset = motionMatch[1].trim();
    
    const entranceMatch = configText.match(/ENTRANCE:\s*([^\n]+)/i);
    if (entranceMatch) result.visualConfig.entranceMotion = entranceMatch[1].trim();
    
    const hoverMatch = configText.match(/HOVER:\s*([^\n]+)/i);
    if (hoverMatch) result.visualConfig.hoverMotion = hoverMatch[1].trim();
    
    const ambientMatch = configText.match(/AMBIENT:\s*([^\n]+)/i);
    if (ambientMatch) result.visualConfig.ambientMotion = ambientMatch[1].trim();
  }

  const htmlMatch = content.match(/```html\n([\s\S]*?)```/) ||
                    content.match(/```tsx\n([\s\S]*?)```/) ||
                    content.match(/```andara-html\n([\s\S]*?)```/);
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

  return result;
}

function detectSlotType(prompt: string, index: number): ParsedBigMindResponse['imagePrompts'][0]['slotType'] {
  const lower = prompt.toLowerCase();
  if (lower.includes('hero') || index === 1) return 'hero';
  if (lower.includes('featured')) return 'featured';
  if (lower.includes('icon')) return 'icon';
  if (lower.includes('gallery')) return 'gallery';
  if (lower.includes('background')) return 'background';
  return 'section';
}

function detectSlotTypeFromLabel(label: string): ParsedBigMindResponse['imagePrompts'][0]['slotType'] {
  const lower = label.toLowerCase();
  if (lower.includes('hero')) return 'hero';
  if (lower.includes('featured')) return 'featured';
  if (lower.includes('icon')) return 'icon';
  if (lower.includes('gallery')) return 'gallery';
  if (lower.includes('background')) return 'background';
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
