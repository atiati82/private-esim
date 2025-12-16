import React from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { findAllGlobalProducts } from '@/data/find-products';
import { RootPageParams } from '@/lib/types';
import { GlobalEsimsUrlSegment } from '@/lib/urls';
import { appGetPayload } from '@/payload/utils/get-payload';

import { MainTabsAndSearch } from '@/app/[locale]/(home-page-components)/main-tabs-and-search';
import { Headline } from '@/components/ui/Headline';
import { sortProducts } from '@/feat-products-listing/product-list-helpers';
import { ProductsList } from '@/feat-products-listing/products-list';
import * as styles from './page.css';

export interface GlobalEsimListingPageParams {
  // location: string;
}
export interface GlobalEsimListingPageArgs {
  params: Promise<RootPageParams & GlobalEsimListingPageParams>;
}

// export async function generateStaticParams(): Promise<DestinationPageParams[]> {
//   const payload = await appGetPayload();
//   const destinations = await findDestinations(payload);
//   return destinations
//     .filter((destination) => isFullBuild || destination.isTopDestination)
//     .map((destination) => ({ destination: destination.slug }));
// }

/**
 * Main page showing **Global eSIMs**
 */
const GlobalEsimListingPage: React.FC<GlobalEsimListingPageArgs> = async ({ params }) => {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const payload = await appGetPayload();
  const globalProducts = await findAllGlobalProducts(payload);
  sortProducts(globalProducts);

  return (
    <>
      <MainTabsAndSearch activeSlug={GlobalEsimsUrlSegment} />

      <div className={styles.pageWrapper}>
        <Headline like="h2-large" className={styles.headline}>
          Global eSIM packages
        </Headline>

        <ProductsList products={globalProducts} location={undefined} />
      </div>
    </>
  );
};

export default GlobalEsimListingPage;
