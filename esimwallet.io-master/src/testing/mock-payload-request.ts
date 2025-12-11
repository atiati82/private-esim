import type { PayloadRequest } from 'payload';

import { safeJsonParse, stringToStream } from '@/lib/utils';
import { UserDto } from '@/payload/app-types';
import { appGetPayload } from '@/payload/utils/get-payload';

import { mockUserInPayload } from '@/testing/users-in-payload';

/**
 * Mocking {@link PayloadRequest} as required for endpoint testing
 */
export async function mockPayloadEndpointRequest(
  req: Partial<PayloadRequest> = {},
  extras: MockPayloadEndpointRequestOpts = {},
): Promise<PayloadRequest> {
  const payload = await appGetPayload();
  const user = extras.user ?? (await mockUserInPayload({}));
  const headers = new Headers(extras.headers);

  // Prepare body stream (if provided)... either from object or from string
  const bodyContent: string | null | undefined =
    extras.body && typeof extras.body === 'object' ? JSON.stringify(extras.body) : extras.body;
  const body: ReadableStream | null = (bodyContent && stringToStream(bodyContent)) || null;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const json = async (): Promise<any> => safeJsonParse(bodyContent)[0];

  return {
    payload,
    user,
    headers,
    body,
    json,
    ...req,
  } as PayloadRequest;
}

type MockPayloadEndpointRequestOpts = {
  user?: UserDto;
  headers?: Record<string, string>;
  body?: string | object | null;
};
