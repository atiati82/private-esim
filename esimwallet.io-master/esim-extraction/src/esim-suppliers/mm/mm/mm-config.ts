import * as process from 'node:process';
import path from 'path';

import { AppCacheDir, ensureCacheDir } from '@/payload/utils/cache';

export const mmConfig = {
  apiBaseUrl: 'https://api.mobimatter.com/mobimatter/api/v2',
  merchantId: process.env.MOBIMATTER_MERCHANT_ID || '',
  apiKey: process.env.MOBIMATTER_API_KEY || '',
  productsCacheFile: path.resolve(`${AppCacheDir}/mm-products.json`),
};

export function ensureMobiMatterEnv(config = mmConfig): void {
  if (!process.env.MOBIMATTER_MERCHANT_ID) {
    throw new Error(
      'Missing MOBIMATTER_MERCHANT_ID key. Please set MOBIMATTER_MERCHANT_ID environment variable.',
    );
  }
  if (!process.env.MOBIMATTER_API_KEY) {
    throw new Error(
      'Missing MOBIMATTER_API_KEY key. Please set MOBIMATTER_API_KEY environment variable.',
    );
  }

  ensureCacheDir(config.productsCacheFile);
}
