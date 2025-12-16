// @ts-check

import withPlugins from 'next-compose-plugins';
import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';
import { withPayload } from '@payloadcms/next/withPayload';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const isDevelopment = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,
  logging: {
    fetches: { fullUrl: true },
  },
  productionBrowserSourceMaps: true, // TODO: temporary

  experimental: {
    staleTimes: { dynamic: 0 },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/media/file/**',
      },
      {
        hostname: 'placehold.co',
      },
      {
        hostname: 'images.unsplash.com',
      },
    ],
  },

  webpack: (config, { isServer, webpack }) => {
    if (!isServer && isDevelopment) {
      config.optimization = {
        ...config.optimization,
        // chunkIds: 'named',
        moduleIds: 'named',
      };
    }

    // This is a fix for Next.js unreliable CSS ordering. ATM, styles are merged in an unpredictable order
    // which results sometimes with incorrect @layers definition (e.g. base isn't 1st, but 2nd or 3rd,
    // in terms of @layer priority.
    // To mitigate it, we inject at the beginning of each .css final file our @layer's definition.
    const bannerPlugin = new webpack.BannerPlugin({
      banner: '@layer base, theme, comp, utils; \n\n',
      raw: true,
      test: /\.css$/,
    });
    config.plugins = [...config.plugins, bannerPlugin];

    return config;
  },

  excludeDefaultMomentLocales: true,
  poweredByHeader: false,
};

export default withPlugins(
  [
    createVanillaExtractPlugin(),
    withPayload,
    createNextIntlPlugin(),
    bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' }),
  ],
  nextConfig,
);
