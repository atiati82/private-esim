import 'dotenv/config'; // just to prevent inclusion of this file in client components

/**
 * Indicates that app is running on PRODUCTION environment
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Indicates that app is running on non-PRODUCTION environment
 */
export const isDevelopment = !isProduction;

/**
 * Indicates that things are running inside unit tests
 */
export const isTestingEnv = !!process.env.TEST;

/**
 * Indicates that server is being accessed on http://localhost/ url
 */
export const isLocalhost = (process.env.__NEXT_PRIVATE_ORIGIN ?? '').includes('localhost');

/**
 * Full production build has been requested
 * and e.g. all static pages are generated.
 */
export const isFullBuild = process.env.APP_FULL_BUILD === 'true';
