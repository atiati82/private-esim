import { Metadata } from 'next';

import { isDevelopment } from '@/env-helpers';

export function generateMetadata(): Metadata {
  return {
    title: 'eSIMwallet' + (isDevelopment ? ' DEV' : ''),
    description: 'eSIMwallet',
    applicationName: 'eSIMwallet',
    icons: {
      icon: [
        { url: '/images/favicon.svg', type: 'image/svg+xml' }, // Default favicon
        { url: '/images/favicon.png', type: 'image/png', sizes: '32x32' }, // .png fallback for those who don't support .svg icon
      ],
      apple: [{ url: '/images/favicon-app-icon.png', sizes: '180x180' }],
    },
    manifest: '/site.webmanifest',
  };
}
