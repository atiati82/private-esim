import React from 'react';
import { LoaderIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import * as styles from './loader.css';

type LoaderProps = styles.LoaderVariants & {
  className?: string;
};

/**
 * Used as main lading spinner for loading (router) pages.
 */
export const Loader: React.FC<LoaderProps> = ({ variant }) => {
  return (
    <div className={cn(styles.loaderVariants({ variant }))}>
      <LoaderIcon strokeWidth={1} size={48} className={styles.spinner} />
    </div>
  );
};
