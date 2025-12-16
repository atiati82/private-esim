import isEqual from 'lodash/isEqual';

import { Destination } from '@/data/destination';
import { EsimProduct } from '@/data/esim-product';
import { findDestinations } from '@/data/find-destinations';
import { findProducts } from '@/data/find-products';
import { getCliLogger, LoggerName } from '@/lib/logging';
import { DestinationsCollectionId } from '@/payload/collections';
import { getRelationIdVal } from '@/payload/utils/data-utils';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { collectProductStats } from './collect-product-stats';

export async function destinationsUpdateWithExtraData(): Promise<void> {
  const payload = await appGetPayloadStandalone();
  const logger = getCliLogger(LoggerName.MobiMatterProductsImport);
  const dbProducts: EsimProduct[] = await findProducts(payload);
  const dbDestinations: Destination[] = await findDestinations(payload);

  let updatesCounter = 0;
  try {
    for (const destination of dbDestinations) {
      const localProducts: EsimProduct[] = dbProducts.filter((product) =>
        product.destinations.map(getRelationIdVal).includes(destination.id),
      );
      const productStats = collectProductStats(localProducts);
      const needsUpdate = !isEqual(productStats, destination.productStats);
      if (!needsUpdate) {
        continue;
      }

      await payload.update({
        collection: DestinationsCollectionId,
        id: destination.id,
        data: { productStats },
      });
      updatesCounter++;
    }
  } catch (e) {
    const err = e as Error;
    logger.error(err.name);
    logger.error(err.message);
  }

  logger.info(`\tAdded products stats to ${updatesCounter} Destinations.`);
}
