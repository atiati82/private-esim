import type { MetadataRoute } from 'next';

import { isProduction } from '@/env-helpers';

export default function robots(): MetadataRoute.Robots {
  const dynamicRules = isProduction ? { allow: '/' } : { disallow: '/' };
  return {
    rules: {
      userAgent: '*',
      ...dynamicRules,
    },
    // sitemap: 'https://acme.com/sitemap.xml',
  };
}
