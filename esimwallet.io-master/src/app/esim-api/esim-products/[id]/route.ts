import { NextResponse } from 'next/server';

import { findProductById } from '@/data/find-products';
import { RootPageParams } from '@/lib/types';
import { appGetPayload } from '@/payload/utils/get-payload';

export const dynamic = 'error';

export interface RouteArgs {
  params: Promise<
    RootPageParams & {
      id: string;
    }
  >;
}

export async function GET(_: Request, { params }: RouteArgs): Promise<NextResponse> {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const payload = await appGetPayload();
  const product = await findProductById(payload, id);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product, {
    headers: { 'Cache-Control': `public, max-age=${3600 * 24 * 3}, immutable` },
  });
}
