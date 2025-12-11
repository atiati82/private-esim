import React from 'react';
import type { LucideProps } from 'lucide-react';

import { cn } from '@/lib/utils';

import * as styles from './product-mini-feature-line.css';

interface ProductMiniFeatureLineProps extends React.PropsWithChildren {
  className?: string;
  icon: React.ElementType<LucideProps>;
  title: string;
  value: string | number;
  valueSuffix?: string;
}

export const ProductMiniFeatureLine: React.FC<ProductMiniFeatureLineProps> = ({
  className,
  icon: Icon,
  title,
  value,
  valueSuffix,
}) => {
  return (
    <div className={cn(styles.container, className)}>
      <Icon className={styles.icon} strokeWidth={1} />
      {title && <span className={styles.title}>{title}</span>}
      <span className={styles.value}>
        {value}
        {valueSuffix && (
          <span className={styles.valueSuffix}>
            {value !== undefined ? ' ' : ''}
            {valueSuffix}
          </span>
        )}
      </span>
    </div>
  );
};
