import React, { Suspense, use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';

import '@/styles/app-global.css'; // import BEFORE! any of our components, to have base styles 1st

import { RouterWatcher } from '@/data-store/router/RouterWatcher';
import { StoreProvider } from '@/data-store/StoreProvider';
import { isFullBuild, isProduction } from '@/env-helpers';
import { defaultLocale, siteLocales, type Locale } from '@/i18n/routing';
import { RootPageParams } from '@/lib/types';

import { GTMHeadScript, GTMNoScript } from '@/app-analytics/gtm/gtm-scripts';
import { Footer } from '@/app/[locale]/_page_footer/footer';
import { PageNavigation } from '@/app/[locale]/_page-nav/page-navigation';
import { generateMetadata } from '@/app/metadata';
import { AppProviders } from '@/app/providers';
import { fontSatoshi } from '@/styles/font-satoshi/fonts';

export function generateStaticParams(): RootPageParams[] {
  return siteLocales
    .filter((locale) => isFullBuild || locale === defaultLocale)
    .map((locale) => ({ locale }));
}

export { generateMetadata };

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const RootLayout: React.FC<LayoutProps> = ({ children, params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale as Locale);

  return (
    <html lang={locale} className={fontSatoshi.variable}>
      <head title="">
        <GTMHeadScript />
      </head>
      <StoreProvider dispatchInitActions={true}>
        <body>
          <AppProviders>
            <Suspense fallback={null}>
              {/* Wrap RouterWatcher into Suspense - otherwise listening to some router events */}
              {/* (like searchParams) will switch this entire layout/page to client rendering */}
              <RouterWatcher />
            </Suspense>

            <PageNavigation />
            {children}
            <Footer />

            {isProduction && <SpeedInsights />}
          </AppProviders>

          <GTMNoScript />
        </body>
      </StoreProvider>
    </html>
  );
};
export default RootLayout;
