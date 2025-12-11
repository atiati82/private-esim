import React from 'react';

import { Destination } from '@/data/destination';
import { EsimProduct, isDataPlanType, isVoicePlanType } from '@/data/esim-product';
import { Region } from '@/data/region';
import { formatPlanAllowanceNum } from '@/lib/esim-wallet';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';

import { CurrencyFormatter } from '@/components/ui/currency-formatter';
import * as styles from './family-product-item.css';

interface FamilyProductItemProps {
  className?: string;
  product: EsimProduct;
  location: Destination | Region | undefined;
  productDiscount?: number;
  url: string;
}

/**
 * Product Mini Card - to feature eSIM package on the listing pages,
 * perhaps inside blog post content etc.
 */
export const FamilyProductItem: React.FC<FamilyProductItemProps> = ({
  className,
  product,
  productDiscount,
  url,
}) => {
  return (
    <Link href={url} className={cn(styles.productItem, className)}>
      <div className={cn(styles.productInfo)}>
        {isDataPlanType(product) && (
          <span className={styles.productInfoTitle}>
            {formatPlanAllowanceNum(product.planDataAllowance)} GB
          </span>
        )}
        {isVoicePlanType(product) && (
          <span className={styles.productInfoTitle}>
            {formatPlanAllowanceNum(product.planVoiceAllowance)} min
          </span>
        )}
        <span className={styles.productSubtitle}>
          {product.planValidity} {product.planValidity === 1 ? 'day' : 'days'}
        </span>
      </div>

      <div className={cn(styles.productPricing)}>
        <CurrencyFormatter amount={product.productPricing.listPrice} />
        {isDataPlanType(product) && (
          <CurrencyFormatter
            className={styles.productPricingPerUnit}
            amount={product.productPricing.pricePerGb}
            suffix=" / GB"
          />
        )}
        {isVoicePlanType(product) && !isDataPlanType(product) && (
          <CurrencyFormatter
            className={styles.productPricingPerUnit}
            amount={product.productPricing.pricePerMin}
            suffix=" / min"
          />
        )}
      </div>

      <div className={cn(styles.productDiscount)}>
        {productDiscount ? `-${productDiscount}%` : ''}
      </div>
    </Link>
  );
};
