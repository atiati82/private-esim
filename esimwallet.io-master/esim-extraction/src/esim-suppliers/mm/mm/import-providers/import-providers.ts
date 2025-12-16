import type { File, Payload } from 'payload';

import { getCliLogger, LoggerName } from '@/lib/logging';
import { slug } from '@/lib/utils';
import { EsimProviderDto } from '@/payload/app-types';
import { EsimProvidersCollectionId } from '@/payload/collections';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';
import { downloadImageAsBuffer } from '@/payload/utils/image';

import { MmProvider } from '../mm-products.types';

/**
 * Import MM Providers. If provider already in DB, skip.
 * @returns list of created EsimProviders
 */
export async function importMobiMatterProviders(
  mmData: MmProvider[],
): Promise<Array<EsimProviderDto | undefined>> {
  const payload = await appGetPayloadStandalone();
  const logger = getCliLogger(LoggerName.MobiMatterProvidersImport);

  const providers = collectProviders(mmData);
  logger.info(`eSIM providers: found ${providers.length} providers to import`);

  const res = providers.map(async (p) => {
    const providerInDb = await payload.find({
      collection: EsimProvidersCollectionId,
      where: { id: { equals: p.id } },
    });
    if (providerInDb.totalDocs === 0) {
      return importSingleProviderWithImage(payload, p as EsimProviderDto);
    } else {
      logger.debug(`Provider [${p.id}] ${p.name} already in DB - skipping`);
      return;
    }
  });

  return Promise.all(res);
}

async function importSingleProviderWithImage(
  payload: Payload,
  providerData: EsimProviderDto,
): Promise<EsimProviderDto> {
  const logger = payload.logger;
  logger.debug(`Will import provider [${providerData.id}] ${providerData.name}`);

  const { thumbnailURL, ...data } = providerData;
  let file: File | undefined = undefined;
  try {
    file = thumbnailURL ? await downloadImageAsBuffer(thumbnailURL) : undefined;
  } catch (err) {
    logger.warn(`Couldn't import provider logo ${thumbnailURL}. Error ${(err as Error).name}.`);
  }

  const created = await payload.create({
    collection: EsimProvidersCollectionId,
    data: data as EsimProviderDto,
    file,
  });
  logger.info(`Successfully imported provider [${created.id}] ${created.name}`);
  logger.info(file ? `   together with logo ${file.name}` : `   without logo file.`);
  return created;
}

/**
 * Collect unique list of providers to import.
 * Do necessary data massaging (name correction, adding website urls etc.)
 */
export function collectProviders(mmData: MmProvider[]): EsimProviderDto[] {
  const res: EsimProviderDto[] = [];

  const presentMmProviderIds: number[] = [];
  mmData.forEach((p) => {
    if (presentMmProviderIds.includes(p.providerId)) {
      return;
    }
    presentMmProviderIds.push(p.providerId);

    res.push(mmMakeProvider(p));
  });

  return res;
}

/**
 * Make EsimProviderDto obj from MmProvider data
 */
export function mmMakeProvider(mmProvider: MmProvider): EsimProviderDto {
  const name = providerNameMap[mmProvider.providerName] ?? mmProvider.providerName;
  const id = providerNameToIdMap[name] ?? slug(name);
  const websiteUrl = providerWebsiteMap[name];

  return {
    id,
    name: name,
    websiteUrl,
    thumbnailURL: mmProvider.providerLogo,
  } as EsimProviderDto;
}

const providerNameMap: Record<string, string> = {
  '3': '3 HK',
};
const providerNameToIdMap: Record<string, string> = {
  '3 HK': 'three-hk',
  'eSIMGo': 'esim-go',
  'GlobaleSIM': 'global-esim',
  'TSimTech': 'tsim-tech',
};
const providerWebsiteMap: Record<string, string> = {
  '3 HK': 'https://www.three.com.hk/en/',
  'dtac': 'https://www.dtac.co.th/en/',
};
