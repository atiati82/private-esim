import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { intlRoutingConfig } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(intlRoutingConfig);

export default function middleware(req: NextRequest): Response | NextResponse {
  const isLocalhost = req.headers.get('host')!.includes('localhost');

  const isVercelUrl = req.url.includes('_vercel/');
  if (isVercelUrl) {
    // Handle requests to /_vercel:
    // - don't pass them through intlMiddleware
    // - modify localhost responses, so they don't result with 404
    //   e.g. for /_vercel/speed-insights/ scripts, present on PRODUCTION build)
    if (isLocalhost) {
      return new Response(null, { status: 204 });
    } else {
      return NextResponse.next();
    }
  }

  if (!isLocalhost && !isAuthenticated(req.headers.get('authorization'))) {
    return requestAuthentication();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - payload/ back-end
     * - api (Payload), esim-api (NextJS route handlers)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - public/* directories
     * - favicon and robots files
     */
    '/((?!api|esim-api|payload|_next/static|_next/image|flags/|images/|favicon.ico|robots.txt|site.webmanifest).*)',
  ],
};

function isAuthenticated(authHeader: string | null): boolean {
  if (!authHeader) {
    return false;
  }

  const authExpected = `${process.env.DEV_PASSWORD}`.toLowerCase();
  if (!authExpected) {
    throw new Error('Missing ENV variable DEV_PASSWORD.');
  }

  const authReceived = Buffer.from(authHeader.split(' ')[1] ?? '', 'base64')
    .toString()
    .toLowerCase() // keep it simple, always compare lowercase version of the password
    .split(':');
  // Ignore username part, just verify the password
  return authReceived[1] === authExpected;
}

function requestAuthentication(): NextResponse {
  const privateEsimPoem = `
    Private eSIM, bridge to the stars,
    Beyond mere data, breaking bars.
    From GSM roots to cosmic heights,
    Connecting souls, igniting lights.

    In every byte, a world unfolds,
    Guided by truths the universe holds.
    A higher source, our tether tight,
    Elevating minds to endless flight.

    Boundless journeys, vast and free,
    Linking humanity’s destiny.
    Through realms unseen, we chart the way—
    Private eSIM, the path, the stay.

    BTW: Authentication required.`;

  return new NextResponse(privateEsimPoem, {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic' },
  });
}
