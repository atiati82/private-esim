import React from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { EsimProductType } from '@/data/esim-product';
import { findDestinations } from '@/data/find-destinations';
import { findProductById, findProducts } from '@/data/find-products';
import { findRegions } from '@/data/find-regions';
import { RootPageParams } from '@/lib/types';
import { GlobalEsimsUrlSegment, RegionEsimsUrlSegment, urlForProductsList } from '@/lib/urls';
import { useCmsContent } from '@/payload/cms-content/use-cms-content.hook';
import { appGetPayload } from '@/payload/utils/get-payload';

import { LocationTabs } from '@/app/[locale]/(home-page-components)/location-tabs';
import { compileProductFeatures } from '@/feat-product/compile-product-features';
import { ProductCard } from '@/feat-product/product-card';
import { ProductsListDestinationTitle } from '@/feat-products-listing/products-list-destination-title';
import { pageContainer } from '@/styles/layout.css';
import * as styles from './page.css';

export interface EsimProductPageParams {
  esim: string;
  destination?: string;
  region?: string;
}
export interface DestinationEsimProductPageArgs {
  params: Promise<RootPageParams & EsimProductPageParams>;
}

const EsimProductPage: React.FC<DestinationEsimProductPageArgs> = async ({ params }) => {
  const {
    locale,
    region: regionSlug,
    destination: destinationSlug,
    esim: productId,
  } = await params;
  unstable_setRequestLocale(locale);

  const payload = await appGetPayload();
  const regions = await findRegions(payload);
  const destinations = await findDestinations(payload);

  const isLocalSection = !!destinationSlug;
  const isRegionSection = !!regionSlug;
  const isGlobalSection = !isLocalSection && !isRegionSection;

  const location = isLocalSection
    ? destinations.find((d) => d.slug === destinationSlug)
    : isRegionSection
      ? regions.find((r) => (r.slug = regionSlug))
      : undefined;

  const product = await findProductById(payload, productId);
  const productTopUps = await findProducts(payload, {
    productType: EsimProductType.TopUp,
    destinations: location ? [location.id] : [],
    productFamily: product.productFamily,
  });

  const productFeatures = compileProductFeatures(product, {
    productsContent: useCmsContent().getProductsContent(),
    destinations,
  });

  const activeTab = isGlobalSection
    ? GlobalEsimsUrlSegment
    : isRegionSection
      ? RegionEsimsUrlSegment
      : '';

  return (
    <>
      <LocationTabs className={styles.locationTabs} activeSlug={activeTab} />
      <div className={pageContainer}>
        <ProductsListDestinationTitle
          location={location}
          href={urlForProductsList(location?.slug)}
        />

        <ProductCard
          product={product}
          productTopUps={productTopUps}
          productFeatures={productFeatures}
          location={location}
        />
      </div>
    </>
  );
};

export { EsimProductPage };
export default EsimProductPage;
