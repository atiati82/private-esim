import React from 'react';

import { Destination } from '@/data/destination';
import { EsimProduct, isDataPlanType } from '@/data/esim-product';
import { Region } from '@/data/region';
import { getFamilyNameFromProduct } from '@/lib/esim-wallet';
import { cn } from '@/lib/utils';
import { useCmsContent } from '@/payload/cms-content/use-cms-content.hook';

import { CurrencyFormatter } from '@/components/ui/currency-formatter';
import { Headline } from '@/components/ui/Headline';
import { ProductDestinationsToggle } from '@/feat-product-mini/product-destinations-toggle';
import { compileFamilyProductsFeatures } from '@/feat-product/compile-product-features';
import { ProductFeaturesIcons } from '@/feat-products-listing/product-features-icons';
import { getProductLotName } from '@/feat-products-listing/product-list-helpers';
import * as styles from './family-products-head.css';

export interface FamilyProductsHeadProps {
  className?: string;
  products: EsimProduct[];
  /**
   * Destination aka. country, Region or Global (for `undefined`).
   * Based on that we determine where the product is being displayed.
   */
  location: Destination | Region | undefined;
}

/**
 * Shows top bar with family name, provider
 * on top of product group in the listings
 */
export const FamilyProductsHead: React.FC<FamilyProductsHeadProps> = ({
  className,
  products,
  location,
}) => {
  const product = products[0];
  const lastProduct = products[products.length - 1];
  const destinationsCount = product?.destinations.length || 0;

  const productFeatures = compileFamilyProductsFeatures(product, {
    productsContent: useCmsContent().getProductsContent(),
  });

  const isDataPlan = isDataPlanType(product);
  const lastProductPricePer = isDataPlan
    ? lastProduct.productPricing.pricePerGb
    : lastProduct.productPricing.pricePerMin;
  const familyName = getFamilyNameFromProduct(product);
  const productLotTitle = getProductLotName(product);

  return (
    <div className={cn('family-products-head', styles.wrapper, className)}>
      <div className={styles.rowMain}>
        <Headline as="h3" className={styles.familyInfo} title={familyName}>
          {familyName}
        </Headline>
        <div className={styles.priceWrapper}>
          <span className={styles.priceFromTitle}>From</span>
          <CurrencyFormatter amount={lastProductPricePer} suffix={isDataPlan ? '/ GB' : '/ min'} />
        </div>
      </div>

      <div className={styles.row2nd}>
        <div className={cn(styles.destinationsInfo)}>
          {productLotTitle} for
          <ProductDestinationsToggle
            className={styles.destinationsInfoToggle}
            product={product}
            currentLocation={location}
            suffixLabel={destinationsCount > 1 ? 'destinations' : ''}
          />
        </div>
      </div>

      <ProductFeaturesIcons product={product} productFeatures={productFeatures} />
    </div>
  );
};
