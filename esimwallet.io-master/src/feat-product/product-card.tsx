import React from 'react';
import { SignalIcon } from 'lucide-react';

import { Destination } from '@/data/destination';
import { EsimProduct } from '@/data/esim-product';
import { Region } from '@/data/region';
import { urlForProduct } from '@/lib/urls';
import { cn } from '@/lib/utils';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui.shadcn/accordion';
import { Badge } from '@/components/ui.shadcn/badge';
import { Card } from '@/components/ui.shadcn/card';
import { Textual } from '@/components/ui/textual';
import { ProductBuyButton } from '@/feat-product-mini/product-buy-button';
import { ProductDestinationsToggle } from '@/feat-product-mini/product-destinations-toggle';
import { ProductMiniCard } from '@/feat-product-mini/product-mini-card';
import type { CompiledProductFeatures } from '@/feat-product/compile-product-features';
import { ProductFeatureLine } from '@/feat-product/product-feature-line';
import { ProductTopUpsList } from '@/feat-product/product-top-ups-list';
import { textUlListContent } from '@/styles/typography.css';
import * as styles from './product-card.css';

interface ProductCardProps {
  className?: string;
  /**
   * Destination (country), Region or undefined for global eSIMs
   */
  location: Destination | Region | undefined;
  product: EsimProduct;
  productTopUps: EsimProduct[];
  productFeatures: CompiledProductFeatures;
}

/**
 * Card showing a full eSIM product
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  className,
  product,
  productTopUps = [],
  location,
  productFeatures,
}) => {
  const productUrl = urlForProduct(location?.slug, product.id);
  return (
    <Card variant="modal-grey" className={cn(styles.productCardContainer, className)}>
      <div className={styles.miniCardBackground}>
        <ProductMiniCard
          className={styles.miniCard}
          product={product}
          location={location}
          isDetailsView={true}
        ></ProductMiniCard>
      </div>

      <ProductBuyButton
        isDetailsView={true}
        product={product}
        location={location}
        url={productUrl}
      />

      <Accordion type="multiple" defaultValue={['specs', 'about']} className={styles.accordion}>
        <AccordionItem value="specs">
          <AccordionTrigger>Technical Specification</AccordionTrigger>
          <AccordionContent>
            <ProductFeatureLine
              icon={SignalIcon}
              name="Network Coverage"
              descriptionHtml={productFeatures.connectsToText}
            >
              <ProductDestinationsToggle
                product={product}
                currentLocation={location}
                isDetailsView={true}
              />
            </ProductFeatureLine>

            {Object.values(productFeatures.specsTab)
              .filter(Boolean)
              .map((pf, key) => (
                <ProductFeatureLine
                  key={key}
                  icon={pf.icon}
                  name={pf.name}
                  descriptionHtml={pf.descriptionHtml}
                  description={pf.description}
                />
              ))}
          </AccordionContent>
        </AccordionItem>

        {productFeatures.kycTab && (
          <AccordionItem value="kyc">
            <AccordionTrigger>KYC Extra Information</AccordionTrigger>
            <AccordionContent>
              {Object.values(productFeatures.kycTab)
                .filter(Boolean)
                .map((pf, key) => (
                  <ProductFeatureLine
                    key={key}
                    icon={pf.icon}
                    name={pf.name}
                    description={pf.description}
                    descriptionHtml={pf.descriptionHtml}
                  />
                ))}
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="topUps">
          <AccordionTrigger>
            Top-Ups
            <Badge variant="secondary" className={styles.topUpsCount}>
              {productTopUps.length}
            </Badge>
          </AccordionTrigger>
          <AccordionContent>
            <ProductTopUpsList
              product={product}
              productTopUps={productTopUps}
              location={location}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="about">
          <AccordionTrigger>About</AccordionTrigger>
          <AccordionContent>
            {Object.values(productFeatures.aboutTab)
              .filter(Boolean)
              .map((pf, key) => (
                <ProductFeatureLine
                  key={key}
                  icon={pf.icon}
                  name={pf.name}
                  description={pf.description}
                />
              ))}
            <ul className={textUlListContent}>
              {productFeatures.aboutText.map((text, key) => (
                <Textual key={key} as="li" renderAsHtmlContent={true}>
                  {text}
                </Textual>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ProductBuyButton
        isDetailsView={true}
        product={product}
        location={location}
        url={productUrl}
      />
    </Card>
  );
};
