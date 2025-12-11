import type { Payload } from 'payload';

import { findDestinations } from '@/data/find-destinations';
import { findRegions } from '@/data/find-regions';
import { defaultLocale } from '@/i18n/routing';
import { getCliLogger, LoggerName } from '@/lib/logging';
import { DestinationDto, RegionDto } from '@/payload/app-types';
import { DestinationsCollectionId, RegionsCollectionId } from '@/payload/collections';
import { makeDestinations } from '@/payload/import-destinations/makeDestinations';
import { makeRegions } from '@/payload/import-destinations/makeRegions';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

const LogLabel = '[DESTINATION IMPORT]';

export async function importDestinationsOnInit(forceReImport = false): Promise<void> {
  const payload = await appGetPayloadStandalone();
  const logger = getCliLogger(LoggerName.DestinationsImport);

  const allRegions = await findRegions(payload);
  const allDestinations = await findDestinations(payload);
  logger.info(
    `${LogLabel} Currently in DB: ${allRegions.length} regions, ${allDestinations.length} destinations`,
  );
  if (allRegions.length && allDestinations.length) {
    logger.info(`${LogLabel} Destinations seems to be already imported.`);
    if (!forceReImport) {
      logger.info(`${LogLabel} Nothing to do, finishing.`);
      return;
    }
  }

  logger.info(`${LogLabel} Clearing the database...`);
  await payload.delete({ collection: DestinationsCollectionId, where: {} });
  await payload.delete({ collection: RegionsCollectionId, where: {} });

  logger.info(`${LogLabel} Importing regions:`);
  const regions = await importRegions(payload);

  logger.info(`${LogLabel} Importing destinations:`);
  const destinations = await importDestinations(payload);

  logger.info(`${LogLabel} Done.`);
  logger.info(
    `${LogLabel} Imported ${regions.length} regions and ${destinations.length} destinations.`,
  );
}

async function importRegions(payload: Payload): Promise<RegionDto[]> {
  const importedRegions = makeRegions().map(async (region: RegionDto) => {
    const item: RegionDto = await payload.create({
      collection: RegionsCollectionId,
      data: region,
      locale: defaultLocale,
    });
    payload.logger.info(`New Region: [${item.id}] ${item.name}`);
    return item;
  });
  return Promise.all(importedRegions);
}

async function importDestinations(payload: Payload): Promise<DestinationDto[]> {
  const importedDestinations = makeDestinations().map(async (destination: DestinationDto) => {
    const item = await payload.create({
      collection: DestinationsCollectionId,
      data: destination,
      locale: defaultLocale,
    });
    payload.logger.info(
      `New Destination: [${item.id}] ${item.name} | currency:${item.currency} keywords:${item.keywords}`,
    );
    return item;
  });
  return Promise.all(importedDestinations);
}
