import React from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { EsimProductType } from '@/data/esim-product';
import { findDestinationById, findDestinations } from '@/data/find-destinations';
import { findProducts } from '@/data/find-products';
import { isFullBuild } from '@/env-helpers';
import { RootPageParams } from '@/lib/types';
import { appGetPayload } from '@/payload/utils/get-payload';

import { MainTabsAndSearch } from '@/app/[locale]/(home-page-components)/main-tabs-and-search';
import { Button } from '@/components/ui.shadcn/form/button';
import { Input } from '@/components/ui.shadcn/form/input';
import {
  sortProducts,
  TravelerCardCountriesCountLimit,
} from '@/feat-products-listing/product-list-helpers';
import { ProductsList } from '@/feat-products-listing/products-list';
import { ProductsListDestinationTitle } from '@/feat-products-listing/products-list-destination-title';
import { ProductsListFilter } from '@/feat-products-listing/products-list-filter';
import * as styles from './page.css';

export interface DestinationPageParams {
  destination: string;
}
export interface DestinationPageArgs {
  params: Promise<RootPageParams & DestinationPageParams>;
}

export async function generateStaticParams(): Promise<DestinationPageParams[]> {
  const payload = await appGetPayload();
  const destinations = await findDestinations(payload);
  return destinations
    .filter((destination) => isFullBuild || destination.isTopDestination)
    .map((destination) => ({ destination: destination.slug }));
}

/**
 * Main page showing **local eSIMs** for given destination country.
 */
const DestinationListingPage: React.FC<DestinationPageArgs> = async ({ params }) => {
  const { locale, destination: destinationSlug } = await params;
  unstable_setRequestLocale(locale);

  const payload = await appGetPayload();
  const destination = await findDestinationById(payload, destinationSlug);
  if (!destination) {
    return 'NOT FOUND';
  }

  const products = await findProducts(payload, {
    productType: EsimProductType.eSIM,
    destinations: [destination.id],
  });

  const localProducts = products.filter((p) => p.destinations.length === 1);
  const travelerCardProducts = products.filter(
    (p) => p.destinations.length > 1 && p.destinations.length <= TravelerCardCountriesCountLimit,
  );
  const globalProducts = products.filter(
    (p) => p.destinations.length > TravelerCardCountriesCountLimit,
  );
  sortProducts(localProducts);
  sortProducts(travelerCardProducts);
  sortProducts(globalProducts);

  return (
    <>
      <MainTabsAndSearch />
      <div className={styles.pageWrapper}>
        <ProductsListFilter className={styles.pageFilter} />
        <div className={styles.pageContent}>
          <ProductsListDestinationTitle
            location={destination}
            productsCount={products.length}
          ></ProductsListDestinationTitle>

          {(products.length && (
            <>
              {localProducts.length > 0 && (
                <ProductsList location={destination} products={localProducts} />
              )}
              {travelerCardProducts.length > 0 && (
                <ProductsList
                  title={`Traveler Cards for ${destination.name}:`}
                  location={destination}
                  products={travelerCardProducts}
                />
              )}
              {globalProducts.length > 0 && (
                <ProductsList
                  title={`Global eSIMs covering ${destination.name}:`}
                  location={destination}
                  products={globalProducts}
                />
              )}
            </>
          )) || (
            <>
              <div className="container max-w-screen-md text-center">
                <p className="pb-8 text-sm text-muted-foreground">
                  Sorry maestros, currently we do not have any eSIM packages for this destination.
                </p>
                <p className="pb-2 text-sm text-muted-foreground">
                  We&apos;re fully aware this is undesired situation and we apologize. Life is hard
                  on its own, not to mention life with no data. Leave us your e-mail below and
                  we&apos;ll notify you (<strong>with a handsome discount coupon!</strong>) as soon
                  as this is reconciled.
                </p>
                <div className="flex items-center justify-center">
                  <Input placeholder="Your e-mail address" className="max-w-72" />
                  <Button className="ml-2">Submit</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DestinationListingPage;
