'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: [0.23, 0.82, 0.35, 1] },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.1 },
  },
  viewport: { once: true, amount: 0.1 },
};

function decodeHtmlEntities(text: string): string {
  if (typeof document === 'undefined') return text;
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
      const isHero = attrs.includes('hero') || content.includes('andara-hero');
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
      const isHero = attrs.includes('hero') || content.includes('andara-hero');
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
}) {
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
      className="andara-animated-section"
      data-section-id={section.id}
      dangerouslySetInnerHTML={{ __html: section.content }}
    />
  );
}

export interface AndaraPageRendererProps {
  html: string;
  className?: string;
}

export default function AndaraPageRenderer({ html, className = '' }: AndaraPageRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(() => parseHtmlIntoSections(html), [html]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const grids = container.querySelectorAll('.andara-grid');
    grids.forEach((grid, gridIndex) => {
      const items = grid.querySelectorAll('.andara-grid__item');
      items.forEach((item, i) => {
        const el = item as HTMLElement;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
          el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 100 + gridIndex * 200 + i * 80);
      });
    });

    const faqItems = container.querySelectorAll('.andara-faq__item');
    faqItems.forEach((item, i) => {
      const el = item as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'translateY(15px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 100);
    });

    const bullets = container.querySelectorAll('.andara-hero__bullets li');
    bullets.forEach((bullet, i) => {
      const el = bullet as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'translateX(-10px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      }, 400 + i * 100);
    });
  }, [sections]);

  if (sections.length === 1 && (sections[0].type === 'full' || sections[0].type === 'main')) {
    return (
      <motion.div
        ref={containerRef}
        className={`andara-page-wrapper ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        dangerouslySetInnerHTML={{ __html: sections[0].content }}
        data-testid="andara-page-animated"
      />
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={`andara-page-wrapper ${className}`}
      {...staggerContainer}
      data-testid="andara-page-animated"
    >
      {sections.map((section, index) => (
        <AnimatedSection key={section.id || index} section={section} index={index} />
      ))}
    </motion.div>
  );
}
