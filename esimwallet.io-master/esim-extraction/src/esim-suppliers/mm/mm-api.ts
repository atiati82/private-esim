import fs from 'fs';
import path from 'path';

import { getCliLogger, LoggerName } from '@/lib/logging';
import { throwErrorIfErroneousResponse } from '@/lib/responses';

import { ensureMobiMatterEnv, mmConfig } from './mm-config';
import { MmOrder, MmProviderInfo } from './mm-orders.types';
import { MmProduct } from './mm-products.types';

export const MobimatterAPI = {
  baseUrl: mmConfig.apiBaseUrl,
  fetchOrderInfoUrl: `${mmConfig.apiBaseUrl}/order`, // :orderId
  fetchProviderInfoUrl: `${mmConfig.apiBaseUrl}/provider/info`, // :orderId
  fetchMmProductsUrl: `${mmConfig.apiBaseUrl}/products`,

  fetchOrderInfo,
  fetchProviderInfo,
  fetchMmProducts,
};

async function fetchOrderInfo(orderId: string): Promise<MmOrder> {
  const apiUrl = `${mmConfig.apiBaseUrl}/order/${orderId}`; // Replace with your actual API URL

  return fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getMobimatterAuthHeaders(),
    },
  })
    .then(throwErrorIfErroneousResponse)
    .then((response) => response.json())
    .then((response) => response.result);
}

async function fetchProviderInfo(orderId: string): Promise<MmProviderInfo> {
  const apiUrl = `${MobimatterAPI.fetchProviderInfoUrl}/${orderId}`; // Replace with your actual API URL

  return fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getMobimatterAuthHeaders(),
    },
  })
    .then(throwErrorIfErroneousResponse)
    .then((response) => response.json());
}

/**
 * Request and download MobiMatter products database
 */
async function fetchMmProducts(): Promise<MmProduct[]> {
  const log = getCliLogger(LoggerName.MobiMatterProductsImport);
  ensureMobiMatterEnv();
  const cacheFilePath = path.resolve(mmConfig.productsCacheFile);

  const dataFromCacheFile = (): MmProduct[] => {
    if (fs.existsSync(cacheFilePath)) {
      log.info('Product data from cached file...');
      const data = fs.readFileSync(cacheFilePath, 'utf8');
      return JSON.parse(data).result;
    } else {
      log.info('Product data cache file not present.');
      return [];
    }
  };

  // Check if the cache file exists and is fresh
  if (fs.existsSync(cacheFilePath)) {
    const stats = fs.statSync(cacheFilePath);
    const millisecondsSinceLastModified = Date.now() - stats.mtime.getTime();
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    if (millisecondsSinceLastModified < oneDayInMilliseconds) {
      return dataFromCacheFile();
    } else {
      log.info('Products cache file present, but stale - fetching fresh version...');
    }
  }

  if (!mmConfig.merchantId || !mmConfig.apiKey) {
    log.error('ERROR: Missing MobiMatter ENV variables.');
    log.error(`API MerchantID: ${mmConfig.merchantId ? 'present' : 'MISSING'}.`);
    log.error(`API KEY: ${mmConfig.apiKey ? 'present' : 'MISSING'}.`);
    return dataFromCacheFile();
  }

  const response = await fetch(MobimatterAPI.fetchMmProductsUrl, {
    method: 'GET',
    headers: getMobimatterAuthHeaders(),
  });
  if (!response.ok) {
    log.error('Error while fetching MobiMatter products.');
    log.error(`Response status: ${response.status}.`);
    return dataFromCacheFile();
  }

  const jsonData = await response.json();
  if (response.status === 200 && jsonData.result.length) {
    fs.writeFileSync(cacheFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
  } else {
    log.error('Error while fetching MobiMatter products.');
    log.error('Response is OK, but empty product list received.');
    return dataFromCacheFile();
  }

  return jsonData.result as MmProduct[];
}

function getMobimatterAuthHeaders(): HeadersInit {
  return { 'merchantId': mmConfig.merchantId, 'api-key': mmConfig.apiKey };
}
