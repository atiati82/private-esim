import React from 'react';

import { Destination } from '@/data/destination';
import { EsimProduct } from '@/data/esim-product';
import { Region } from '@/data/region';
import { cn } from '@/lib/utils';

import { FamilyProductsList } from '@/feat-products-listing/family-products-list';
import { productsByFamily } from '@/feat-products-listing/product-list-helpers';
import { ProductsListDestinationTitle } from '@/feat-products-listing/products-list-destination-title';
import * as styles from './products-list.css';

export interface EsimProductsListProps {
  className?: string;
  title?: string;
  noProductsMsg?: string;
  products: EsimProduct[];
  /**
   * Destination aka. country, Region or Global (for `undefined`).
   * Based on that we determine where the product is being displayed.
   */
  location: Destination | Region | undefined;
}

/**
 * Show list of products, grouped by family
 */
export const ProductsList: React.FC<EsimProductsListProps> = ({
  className,
  title,
  noProductsMsg,
  products,
  location,
}) => {
  const productGroups = productsByFamily(products);

  return (
    <div className={cn(styles.container, className)}>
      {location && title && (
        <ProductsListDestinationTitle location={location} productsCount={products.length}>
          {title}
        </ProductsListDestinationTitle>
      )}

      {!products.length && noProductsMsg && (
        <p
          className={cn('no-products-msg', styles.noProductsMsg)}
          dangerouslySetInnerHTML={{ __html: noProductsMsg }}
        ></p>
      )}

      {productGroups.map((group) => (
        <FamilyProductsList
          key={group.familyId}
          provider={group.provider}
          products={group.products}
          location={location}
        />
      ))}
    </div>
  );
};
