import React from 'react';
import Link from 'next/link';

import { Headline } from '@/components/ui/Headline';
import * as styles from './footer-section.css';

interface FooterSectionProps {
  title: string;
  items: { name: string; url: string }[];
  className?: string;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ title, items, className }) => {
  return (
    <div className={className}>
      <Headline as="h4" className={styles.footerSectionTitle}>
        {title}
      </Headline>
      <div className={styles.footerSectionList}>
        <ul>
          {items.map((item) => (
            <li key={item.name}>
              <Link href={item.url} className={styles.footerNavLinks}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
