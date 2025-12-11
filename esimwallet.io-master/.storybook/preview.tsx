import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { withThemeByClassName } from '@storybook/addon-themes';
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Preview, StoryContext } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { initialize, mswLoader } from 'msw-storybook-addon';

import { MeUserApiUrl } from '@/config';
import { StoreProvider } from '@/data-store/StoreProvider';
import enMessages from '@/i18n/en.json';
import { defaultLocale } from '@/i18n/routing';

import '@/styles/app-global.css'; // Include base CSS styles

/*
 * Initialize MSW request mocks
 */
initialize({ onUnhandledRequest: 'bypass' }, [
  http.get(MeUserApiUrl, () => {
    return HttpResponse.json({});
  }),
]);

export const preview: Preview = {
  tags: ['autodocs'],
  loaders: [mswLoader], // Add the MSW loader to all stories
  parameters: {
    layout: 'centered',
    viewport: {
      viewports: {
        responsive: {
          name: 'Responsive',
          styles: { width: '100%', height: '100%' },
          type: 'desktop',
        },
        ...INITIAL_VIEWPORTS,
        ...MINIMAL_VIEWPORTS,
      },
      // defaultViewport: 'responsive',
    },
    docs: {
      argTypes: { sort: 'requiredFirst' },
      controls: {
        exclude: ['className', 'asChild'],
      },
    },
    nextjs: {
      appDirectory: true,
    },
    msw: {
      // handlers: [],
    },
    controls: {
      matchers: {
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        // nameOfTheme: 'classNameForTheme',
        light: 'light',
        dark: 'dark',
        some: 'some-class',
      },
      defaultTheme: 'light',
    }),
    /* Individual story wrapper */
    (Story, ctx: StoryContext) => {
      const { locale = defaultLocale } = ctx.parameters;
      return (
        <StoreProvider>
          <NextIntlClientProvider locale={locale} messages={enMessages}>
            <div className="sb-unstyled">
              <Story />
            </div>
          </NextIntlClientProvider>
        </StoreProvider>
      );
    },
  ],
};

export default preview;
