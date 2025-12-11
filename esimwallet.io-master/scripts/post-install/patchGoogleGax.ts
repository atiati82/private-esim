import * as fs from 'fs';

import { getCliLogger, LoggerName } from '../../src/lib/logging';

/**
 * google-gax (dependency of @google-cloud/recaptcha-enterprise)
 * surprisingly has dependency on and old, unmaintained `request` library.
 * Even if it's not used, tt throws exceptions like below.
 *
 * Couldn't find a better solution, try/catch doesn't seem to work in this case
 * so... patching it here.
 *
 * Exception which was thrown:
 * ```
 *  ⚠ ./node_modules/google-gax/build/src/streamingRetryRequest.js
 * Module not found: Can't resolve 'request' in './node_modules/google-gax/build/src'
 *
 * Import trace for requested module:
 * ./node_modules/google-gax/build/src/streamingRetryRequest.js
 * ./node_modules/google-gax/build/src/streamingCalls/streaming.js
 * ./node_modules/google-gax/build/src/index.js
 * ./node_modules/@google-cloud/recaptcha-enterprise/build/src/v1beta1/recaptcha_enterprise_service_v1_beta1_client.js
 * ./node_modules/@google-cloud/recaptcha-enterprise/build/src/v1beta1/index.js
 * ./node_modules/@google-cloud/recaptcha-enterprise/build/src/index.js
 * ./src/lib/google/recaptcha-client.ts
 * ./src/payload/collections/hooks/validateReCaptcha.ts
 * ./src/payload/collections/users/users.collection.ts
 * ...
 * ```
 */

const logger = getCliLogger(LoggerName.Scripts);

const gaxPath = './node_modules/google-gax/build/src/streamingRetryRequest.js';

const contentToPatch = `    opts.request = require('request');`;
const replaceContent = `    // opts.request = require('request');`;

try {
  const gaxContent = fs.readFileSync(gaxPath, 'utf8');
  if (gaxContent.includes(contentToPatch)) {
    const patchedContent = gaxContent.replace(contentToPatch, replaceContent);
    fs.writeFileSync(gaxPath, patchedContent, 'utf8');
    logger.info('\tSuccessfully patched.');
  } else {
    logger.info('\tAlready patched.');
  }
} catch (err) {
  logger.error('\tFailed to patch google-gax: ' + (err as Error).message);
}
