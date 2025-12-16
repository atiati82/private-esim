import React from 'react';

import { Destination } from '@/data/destination';
import { EsimProduct } from '@/data/esim-product';
import { EsimProvider } from '@/data/provider';
import { Region } from '@/data/region';
import { urlForProduct } from '@/lib/urls';
import { cn } from '@/lib/utils';

import { FamilyProductItem } from '@/feat-products-listing/family-product-item';
import { FamilyProductsHead } from '@/feat-products-listing/family-products-head';
import * as styles from './family-products-list.css';

export interface FamilyProductsListProps {
  className?: string;
  provider: EsimProvider;
  products: EsimProduct[];
  /**
   * Destination aka. country, Region or Global (for `undefined`).
   * Based on that we determine where the product is being displayed.
   */
  location: Destination | Region | undefined;
}

/**
 * Show a single group/family of products
 */
export const FamilyProductsList: React.FC<FamilyProductsListProps> = ({
  className,
  products,
  location,
}) => {
  return (
    <div className={cn(styles.container, className)}>
      <FamilyProductsHead products={products} location={location} />

      <div className={styles.productsListBox}>
        {products.map((product, idx) => (
          <FamilyProductItem
            key={product.id}
            product={product}
            location={location}
            productDiscount={idx ? idx * 8 : 0}
            url={urlForProduct(location?.slug, product.id)}
          />
        ))}
      </div>
    </div>
  );
};
