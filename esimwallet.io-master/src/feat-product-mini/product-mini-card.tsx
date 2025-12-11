import React from 'react';
import { CalendarRange, PhoneCall, PhoneMissed, RadioTower } from 'lucide-react';

import { Destination } from '@/data/destination';
import { EsimProduct, isDataPlanType, isVoicePlanType } from '@/data/esim-product';
import { Region } from '@/data/region';
import { formatPlanAllowanceNum } from '@/lib/esim-wallet';
import { urlForProduct } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from '@/components/ui.shadcn/card';
import { ProductBuyButton } from '@/feat-product-mini/product-buy-button';
import { ProductDestinationsToggle } from '@/feat-product-mini/product-destinations-toggle';
import { ProductEditLink } from '@/feat-product-mini/product-edit-link';
import { ProductMiniFeatureLine } from '@/feat-product-mini/product-mini-feature-line';
import * as styles from './product-mini-card.css';

interface ProductMiniCardProps {
  className?: string;
  product: EsimProduct;

  /**
   * Destination aka. country, Region or Global (for `undefined`).
   * Based on that we determine where the product is being displayed.
   */
  location: Destination | Region | undefined;

  /**
   * When TRUE, it means we're on the eSIM full product page.
   */
  isDetailsView?: boolean;
}

/**
 * Product Mini Card - to feature eSIM package on the listing pages,
 * perhaps inside blog post content etc.
 */
export const ProductMiniCard: React.FC<ProductMiniCardProps> = ({
  className,
  product,
  location,
  isDetailsView,
}) => {
  const productUrl = urlForProduct(location?.slug, product.id);
  return (
    <Card className={cn(styles.card, className)}>
      <CardHeader className={styles.cardHeader} title={product.name}>
        <CardTitle className={styles.cardTitle}>
          <ProductDestinationsToggle
            product={product}
            currentLocation={location}
            className={styles.productDestinations}
          />{' '}
          <span className={styles.cardProductName}>
            {(isDetailsView && product.name) || (
              <Link className={styles.cardProductName} href={productUrl}>
                {product.name}
              </Link>
            )}
          </span>
        </CardTitle>
        <CardSubtitle className={styles.cardSubtitle}>
          {product.provider.name} Provider
        </CardSubtitle>
        <ProductEditLink id={product.id} className={styles.productEditLink} />
      </CardHeader>

      <CardContent className={styles.cardContent}>
        <ProductMiniFeatureLine
          icon={CalendarRange}
          title="Validity"
          value={product.planValidity}
          valueSuffix={product.planValidity === 1 ? 'day' : 'days'}
        />
        <ProductMiniFeatureLine
          icon={RadioTower}
          title="Data"
          value={
            isDataPlanType(product)
              ? formatPlanAllowanceNum(product.planDataAllowance)
              : 'Voice Only'
          }
          valueSuffix={isDataPlanType(product) ? 'GB' : ''}
        />
        <ProductMiniFeatureLine
          icon={product.planVoiceAllowance ? PhoneCall : PhoneMissed}
          title="Voice"
          value={
            isVoicePlanType(product)
              ? formatPlanAllowanceNum(product.planVoiceAllowance)
              : 'Data Only'
          }
          valueSuffix={product.planVoiceAllowance ? 'min' : ''}
        />
      </CardContent>

      {!isDetailsView && (
        <CardFooter className={styles.cardFooter}>
          <ProductBuyButton url={productUrl} product={product} location={location} />
        </CardFooter>
      )}
    </Card>
  );
};
