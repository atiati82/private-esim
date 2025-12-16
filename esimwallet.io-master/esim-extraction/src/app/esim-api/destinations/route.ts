import { NextResponse } from 'next/server';

import { findDestinations } from '@/data/find-destinations';
import { appGetPayload } from '@/payload/utils/get-payload';

export const dynamic = 'error';
// export const runtime = 'edge';

// function delay(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

export async function GET(): Promise<NextResponse> {
  // await delay(5000);
  const payload = await appGetPayload();
  const destinations = await findDestinations(payload);
  return NextResponse.json(destinations, {
    headers: { 'Cache-Control': `public, max-age=${3600 * 24 * 3}, immutable` },
  });
}
