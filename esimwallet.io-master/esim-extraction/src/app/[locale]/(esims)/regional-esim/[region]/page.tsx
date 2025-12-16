import React from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { EsimProductType } from '@/data/esim-product';
import { findProducts } from '@/data/find-products';
import { findRegions } from '@/data/find-regions';
import type { RegionId } from '@/data/region';
import { isFullBuild } from '@/env-helpers';
import { RootPageParams } from '@/lib/types';
import { RegionEsimsUrlSegment } from '@/lib/urls';
import { appGetPayload } from '@/payload/utils/get-payload';

import { MainTabsAndSearch } from '@/app/[locale]/(home-page-components)/main-tabs-and-search';
import {
  sortProducts,
  TravelerCardCountriesCountLimit,
} from '@/feat-products-listing/product-list-helpers';
import { ProductsList } from '@/feat-products-listing/products-list';
import { ProductsListDestinationTitle } from '@/feat-products-listing/products-list-destination-title';
import * as styles from './page.css';

export interface RegionPageParams {
  region: RegionId;
}
export interface RegionPageArgs {
  params: Promise<RootPageParams & RegionPageParams>;
}

export async function generateStaticParams(): Promise<RegionPageParams[]> {
  if (isFullBuild) {
    const payload = await appGetPayload();
    const regions = await findRegions(payload);
    return regions.map((region) => ({ region: region.slug as RegionId }));
  }
  return [];
}

const RegionPage: React.FC<RegionPageArgs> = async ({ params }) => {
  const { locale, region: regionSlug } = await params;
  unstable_setRequestLocale(locale);

  const payload = await appGetPayload();
  const regions = await findRegions(payload);
  const region = regions.find((r) => r.slug === regionSlug);
  if (!region) {
    return 'NOT FOUND';
  }

  const allRegionProducts = await findProducts(payload, {
    productType: EsimProductType.eSIM,
    region: region.id,
  });
  const regionProducts = allRegionProducts.filter(
    (p) => p.destinations.length > 1 && p.destinations.length <= TravelerCardCountriesCountLimit,
  );
  sortProducts(regionProducts);

  return (
    <>
      <MainTabsAndSearch activeSlug={RegionEsimsUrlSegment} />

      <div className={styles.pageWrapper}>
        <ProductsListDestinationTitle
          location={region}
          productsCount={regionProducts.length}
        ></ProductsListDestinationTitle>

        <ProductsList products={regionProducts} location={region} />
      </div>
    </>
  );
};

export default RegionPage;
