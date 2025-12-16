import React from 'react';

import { cn } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui.shadcn/popover';
import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';
import { ProductFeature } from '@/feat-product/compile-product-features';
import * as styles from './product-feature-icon.css';

interface ProductFeatureIconProps {
  className?: string;
  productFeature: ProductFeature;
}

export const ProductFeatureIcon: React.FC<ProductFeatureIconProps> = ({
  className,
  productFeature,
}) => {
  if (!productFeature.description?.length && !productFeature.descriptionHtml) {
    return null;
  }

  const Icon = productFeature.icon;

  return (
    <Popover>
      <PopoverTrigger className={cn(styles.popoverTrigger, className)}>
        <Icon className={styles.icon} strokeWidth={1} />
      </PopoverTrigger>

      <PopoverContent className={styles.content}>
        <Headline as="h4" like="h6-large" className={styles.name}>
          {productFeature.name}
        </Headline>
        {productFeature.descriptionHtml && (
          <Textual renderAsHtmlContent={true}>{productFeature.descriptionHtml}</Textual>
        )}
        {productFeature.description?.map((descr, key) => (
          <Textual key={key}>{descr}</Textual>
        ))}
      </PopoverContent>
    </Popover>
  );
};
