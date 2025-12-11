import React from 'react';

import { isDestinationLocation } from '@/data/data-helpers';
import { Destination } from '@/data/destination';
import { EsimProduct } from '@/data/esim-product';
import { Region } from '@/data/region';
import { cn } from '@/lib/utils';

import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';
import { sortProducts } from '@/feat-products-listing/product-list-helpers';
import { ProductsList } from '@/feat-products-listing/products-list';
import * as styles from './product-top-ups-list.css';

interface ProductTopUpsListProps {
  className?: string;
  /**
   * Destination aka. country, Region or Global (for `undefined`).
   * Based on that we determine where the product is being displayed.
   */
  location: Destination | Region | undefined;
  product: EsimProduct;
  productTopUps: EsimProduct[];
}

/**
 * Inside single product card, shows list of available top ups
 */
export const ProductTopUpsList: React.FC<ProductTopUpsListProps> = async ({
  className,
  product,
  productTopUps = [],
  location,
}) => {
  const isLocalDestination = isDestinationLocation(location);
  const otherTopUpsCount = product.productFamilyTopUpsCount - productTopUps.length;

  sortProducts(productTopUps);

  return (
    <div className={cn(styles.wrapper, className)}>
      <ProductsList
        className={styles.productsList}
        location={location}
        products={productTopUps}
        noProductsMsg="No compatible products found."
      />

      {isLocalDestination && otherTopUpsCount > 0 && (
        <>
          <Headline as="h4">One more thing...</Headline>
          <Textual size="sm">
            This {product.productTypeLabel} also{' '}
            <strong>works with {otherTopUpsCount} other Top-Ups</strong> from our products offering,
            for destinations other than {location.name}.
          </Textual>
        </>
      )}
    </div>
  );
};
