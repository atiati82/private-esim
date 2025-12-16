import { getCliLogger, LoggerName } from '@/lib/logging';

import { importMobiMatterProducts } from './import-products/import-products';
import { importMobiMatterProviders } from './import-providers/import-providers';
import { MobimatterAPI } from './mm-api';
import { destinationsUpdateWithExtraData } from './products-data/destinations-update-with-extra-data';
import { regionsUpdateWithExtraData } from './products-data/regions-update-with-extra-data';

/**
 * Import MobiMatter data (providers, products)
 *
 * @param cleanImport - when set to TRUE, it'll clean the database and re-import (instead of syncing)
 */
export async function importMobiMatter(cleanImport?: boolean): Promise<void> {
  const log = getCliLogger(LoggerName.MobiMatterProductsImport);

  log.info(`Downloading MobiMater products...`);
  const mmData = await MobimatterAPI.fetchMmProducts();
  log.info(`Downloaded ${mmData.length} products.\n`);

  log.info(`IMPORTING PROVIDERS:`);
  const providersImportRes = await importMobiMatterProviders(mmData);
  const importedProviders = providersImportRes.filter(Boolean);
  log.info(`DONE. ${importedProviders.length} providers imported.\n`);

  log.info(`IMPORTING PRODUCTS:`);
  const [productsSuccessfullyProcessedCount, productsToProcessCount] =
    await importMobiMatterProducts(mmData, cleanImport);
  if (productsSuccessfullyProcessedCount !== productsToProcessCount) {
    log.error('There were some issues during import/sync process. Please inspect the import log.');
  }

  log.info(`EXTRA DATA:`);
  await destinationsUpdateWithExtraData();
  await regionsUpdateWithExtraData();

  log.info(`DONE.`);
  log.info(
    `${productsSuccessfullyProcessedCount}/${productsToProcessCount} products successfully processed`,
  );
}
