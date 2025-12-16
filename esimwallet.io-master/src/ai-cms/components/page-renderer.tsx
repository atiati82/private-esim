'use client';

import { useEffect, useMemo, useRef } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';


const staggerContainer = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.1 },
  },
  viewport: { once: true, amount: 0.1 },
};

function decodeHtmlEntities(text: string): string {
  if (typeof document === 'undefined') {
    return text;
  }
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function parseHtmlIntoSections(html: string): { type: string; content: string; id?: string }[] {
  const decoded = html.includes('&lt;') ? decodeHtmlEntities(html) : html;
  const sections: { type: string; content: string; id?: string }[] = [];

  const sectionPattern = /<section([^>]*)>([\s\S]*?)<\/section>/gi;
  const mainPattern = /<main([^>]*)>([\s\S]*?)<\/main>/gi;
  const headerPattern = /<header([^>]*)>([\s\S]*?)<\/header>/gi;

  const mainMatch = mainPattern.exec(decoded);
  if (mainMatch) {
    const mainContent = mainMatch[2];
    const mainAttrs = mainMatch[1];
    const mainId = mainAttrs.match(/id="([^"]+)"/)?.[1];

    const headerMatch = headerPattern.exec(mainContent);
    if (headerMatch) {
      sections.push({ type: 'header', content: headerMatch[0], id: 'hero' });
    }

    let sectionMatch;
    while ((sectionMatch = sectionPattern.exec(mainContent)) !== null) {
      const attrs = sectionMatch[1];
      const content = sectionMatch[0];
      const id = attrs.match(/id="([^"]+)"/)?.[1] || `section-${sections.length}`;
      const isHero = attrs.includes('hero') || content.includes('private-esim-hero');
      sections.push({ type: isHero ? 'hero' : 'section', content, id });
    }

    if (sections.length === 0) {
      sections.push({ type: 'main', content: decoded, id: mainId || 'page' });
    }
  } else {
    let sectionMatch;
    while ((sectionMatch = sectionPattern.exec(decoded)) !== null) {
      const attrs = sectionMatch[1];
      const content = sectionMatch[0];
      const id = attrs.match(/id="([^"]+)"/)?.[1] || `section-${sections.length}`;
      const isHero = attrs.includes('hero') || content.includes('private-esim-hero');
      sections.push({ type: isHero ? 'hero' : 'section', content, id });
    }

    if (sections.length === 0) {
      sections.push({ type: 'full', content: decoded, id: 'page' });
    }
  }

  return sections;
}

function AnimatedSection({
  section,
  index,
}: {
  section: { type: string; content: string; id?: string };
  index: number;
}): React.JSX.Element {
  const isHero = section.type === 'hero' || section.type === 'header';
  const delay = isHero ? 0 : index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: isHero ? 20 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: isHero ? 0.3 : 0.15 }}
      transition={{
        duration: isHero ? 0.8 : 0.6,
        delay,
        ease: [0.23, 0.82, 0.35, 1],
      }}
      className="page-animated-section"
      data-section-id={section.id}
      dangerouslySetInnerHTML={{ __html: section.content }}
    />
  );
}

export interface PageRendererProps {
  html: string;
  className?: string;
}

export const PageRenderer = async ({ pageSlug }: { pageSlug: string }): Promise<React.JSX.Element> => {
  // Assuming 'html' and 'className' would be derived or passed differently in this new async component
  // For the purpose of this edit, we'll keep the existing logic that uses 'html' and 'className'
  // and assume they will be available or fetched based on pageSlug.
  // This is a placeholder for the actual data fetching logic.
  const { appGetPayload } = await import('@/payload/utils/get-payload');
  const payload = await appGetPayload();
  // Fixed: Removed unused 'config' import

  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: {
      slug: {
        equals: pageSlug,
      },
    },
    limit: 1,
  });

  if (!docs.length) {
    return notFound();
  }

  // Fixed: typed page as generic Record to avoid explicit any error
  const page = docs[0] as unknown as Record<string, unknown>;
  let html = (page.aiGeneratedHtml as string) || `<h1>${page.title}</h1><p>Content is being generated...</p>`;

  // Replace brand names in content
  html = html
    .replace(/esimwallet/gi, 'private-esim')
    .replace(/andara/gi, 'private-esim');

  // Use visual config for potential theming in the future
  const visualConfig = typeof page.aiVisualConfig === 'string'
    ? JSON.parse(page.aiVisualConfig as string)
    : page.aiVisualConfig as Record<string, string>;

  const className = visualConfig?.colorScheme ? `theme-${visualConfig.colorScheme}` : '';

  const containerRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(() => parseHtmlIntoSections(html), [html]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;

    const grids = container.querySelectorAll('.page-grid');
    grids.forEach((grid, gridIndex) => {
      const items = grid.querySelectorAll('.page-grid__item');
      items.forEach((item, i) => {
        const el = item as HTMLElement;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(
          () => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          },
          100 + gridIndex * 200 + i * 80,
        );
      });
    });

    const faqItems = container.querySelectorAll('.page-faq__item');
    faqItems.forEach((item, i) => {
      const el = item as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'translateY(15px)';
      setTimeout(
        () => {
          el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        },
        200 + i * 100,
      );
    });

    const bullets = container.querySelectorAll('.private-esim-hero__bullets li');
    bullets.forEach((bullet, i) => {
      const el = bullet as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'translateX(-10px)';
      setTimeout(
        () => {
          el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateX(0)';
        },
        400 + i * 100,
      );
    });
  }, [sections]);

  if (sections.length === 1 && (sections[0].type === 'full' || sections[0].type === 'main')) {
    return (
      <motion.div
        ref={containerRef}
        className={`page-wrapper ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        dangerouslySetInnerHTML={{ __html: sections[0].content }}
        data-testid="page-animated"
      />
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={`page-wrapper ${className}`}
      {...staggerContainer}
      data-testid="page-animated"
    >
      {sections.map((section, index) => (
        <AnimatedSection key={section.id || index} section={section} index={index} />
      ))}
    </motion.div>
  );
}
