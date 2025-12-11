import React from 'react';
import type { LucideProps } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';
import * as styles from './product-feature-line.css';

interface ProductFeatureLineProps extends React.PropsWithChildren {
  className?: string;
  icon: React.ElementType<LucideProps>;
  name: string;
  descriptionHtml?: string;
  description?: string[];
}

export const ProductFeatureLine: React.FC<ProductFeatureLineProps> = ({
  className,
  icon: Icon,
  name,
  children,
  descriptionHtml,
  description,
}) => {
  if (description?.length === 0 && !descriptionHtml && !children) {
    return null;
  }

  return (
    <div className={cn(styles.container, className)}>
      <Icon className={styles.icon} strokeWidth={2} />
      <div className={styles.content}>
        <Headline as="h4" like="h6-large" className={styles.name}>
          {name}
        </Headline>

        {children}

        {descriptionHtml && <Textual renderAsHtmlContent={true}>{descriptionHtml}</Textual>}
        {description?.map((descr, key) => <Textual key={key}>{descr}</Textual>)}
      </div>
    </div>
  );
};
