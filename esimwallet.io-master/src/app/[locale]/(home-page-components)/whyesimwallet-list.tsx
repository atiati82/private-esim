import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

import { urlForPage, UrlForPage } from '@/lib/urls';

import { Headline } from '@/components/ui/Headline';
import * as styles from './whyesimwallet-list.css';

interface WhyEsimwalletListProps {
  items: {
    title: string;
    description: string;
    icon: LucideIcon;
  }[];
}

export const WhyEsimwalletList: React.FC<WhyEsimwalletListProps> = ({ items }) => {
  return (
    <div className={styles.whyEsimWalletListWrapper}>
      {items.map(({ icon: IconComponent, title, description }) => (
        <Link
          href={urlForPage(UrlForPage.WhyEsimWallet)}
          key={title}
          className={styles.whyEsimWalletListContentInfo}
        >
          <IconComponent size={35} className={styles.whyEsimWalletListContentIcon} />
          <Headline as="h3">{title}</Headline>
          <p className={styles.whyEsimWalletListContentDescription}>{description}</p>
        </Link>
      ))}
    </div>
  );
};
