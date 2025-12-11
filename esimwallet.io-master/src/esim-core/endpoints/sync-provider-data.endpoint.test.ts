import { describe, expect, test } from 'vitest';

import { getErrorFromApiResponse } from '@/lib/responses';

import { mockPayloadEndpointRequest } from '@/testing/mock-payload-request';
import { syncProviderDataEndpoint } from './sync-provider-data.endpoint';

describe('Sync Provider Data endpoint', function () {
  describe('endpoint access', () => {
    test('Response 401 when no user', async () => {
      const req = await mockPayloadEndpointRequest({ user: null });
      const res = await syncProviderDataEndpoint(req);
      const err = getErrorFromApiResponse(res, await res.json());
      expect(res.status).toBe(401);
      expect(err?.message).toContain('Invalid user');
    });
  });
});
