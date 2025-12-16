import { EsimProviderDto } from '@/payload/app-types';
import { isObject, makeMinimalRelationObj } from '@/payload/utils/data-utils';

/**
 * Provider obj, based on {@link EsimProviderDto}
 */
export interface EsimProvider {
  id: string;
  name: string;
  logoUrl: string;
  logoWidth: number;
  logoHeight: number;
}

export function makeProviderObj(dto: EsimProviderDto): EsimProvider {
  if (!isObject(dto)) {
    return makeMinimalRelationObj(dto);
  }

  return {
    id: dto.id,
    name: dto.name,
    logoUrl: dto.url || '',
    logoWidth: dto.width || 0,
    logoHeight: dto.height || 0,
  };
}

/**
 * Get shortened/nicer provider id.
 * Use e.g. in generating unique Product ID
 */
export function getShortProviderId(providerId: string): string {
  const provider = providerId.toLowerCase();
  switch (provider) {
    case 'three-hk':
      return '3hk';
    default:
      return provider.replace('-', '');
  }
}
