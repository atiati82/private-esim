import React from 'react';

import { cn } from '@/lib/utils';

import * as styles from './products-list-filter.css';

interface ProductsListFilterProps {
  className?: string;
}

export const ProductsListFilter: React.FC<ProductsListFilterProps> = ({ className }) => {
  return <div className={cn(styles.wrapper, className)}></div>;
};
