import React from 'react';

import { EsimProduct } from '@/data/esim-product';
import { cn } from '@/lib/utils';

import { ProductFeature } from '@/feat-product/compile-product-features';
import { ProductFeatureIcon } from '@/feat-products-listing/product-feature-icon';
import * as styles from './product-features-icons.css';

interface ProductFeaturesIconsProps extends React.PropsWithChildren {
  className?: string;
  product: EsimProduct;
  productFeatures: ProductFeature[];
}

export const ProductFeaturesIcons: React.FC<ProductFeaturesIconsProps> = ({
  className,
  product,
  productFeatures,
}) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      <div
        className={cn(styles.providerInfo)}
        title={product.productTypeLabel + ' from ' + product.provider.name + ' provider'}
      >
        <span className={cn(styles.providerTitle)}>{product.provider.name}</span>
        <span
          className={styles.providerLogo}
          style={{ backgroundImage: `url(${product.provider.logoUrl})` }}
        ></span>
      </div>

      {productFeatures.map((pf, key) => (
        <ProductFeatureIcon key={key} productFeature={pf} />
      ))}
    </div>
  );
};
