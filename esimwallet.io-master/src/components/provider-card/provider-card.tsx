import React from 'react';

import { EsimProvider } from '@/data/provider';
import { cn } from '@/lib/utils';

import { Headline } from '@/components/ui/Headline';
import * as styles from './provider-card.css';

export interface ProviderCardProps {
  className?: string;
  data: EsimProvider;
}

/**
 * Card with provider info. Used in product listings by family.
 */
export const ProviderCard: React.FC<ProviderCardProps> = ({ className, data }) => {
  return (
    <div
      style={{ backgroundImage: `url(${data.logoUrl})` }}
      className={cn(styles.wrapper, className)}
    >
      <Headline as="h6">Provider</Headline>
      <Headline as="h3">{data.name}</Headline>
    </div>
  );
};
