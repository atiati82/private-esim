import { beforeAll, expect, vi } from 'vitest';

import { appGetPayload } from '../src/payload/utils/get-payload';

beforeAll(() => {
  expect(process.env.PAYLOAD_DATABASE_URI, 'MongoDB in-memory should be configured').toContain(
    '&retryWrites',
  );
});

vi.mock('@/payload/utils/get-payload-standalone', () => ({
  appGetPayloadStandalone: vi.fn(() => {
    return Promise.resolve(appGetPayload());
  }),
}));

vi.mock('@payloadcms/plugin-cloud-storage/vercelBlob', () => ({
  vercelBlobAdapter: vi.fn(),
}));
