import { afterEach, expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { MongoMemoryServer } from 'mongodb-memory-server';

import '@vanilla-extract/css/disableRuntimeStyles';
import '@testing-library/jest-dom/vitest';

expect.extend(matchers);

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Setup in memory MongoDB for Payload, override PAYLOAD_DATABASE_URI
if (!global._mongoTestDb) {
  const _mongoTestDb = await MongoMemoryServer.create({
    instance: {
      replicaMemberConfig: {
        buildIndexes: false,
      },
    },
  });

  global._mongoTestDb = _mongoTestDb;
  process.env.PAYLOAD_DATABASE_URI = `${_mongoTestDb.getUri()}&retryWrites=true`;
}
