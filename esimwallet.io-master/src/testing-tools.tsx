import React, { PropsWithChildren } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { render, RenderResult, type RenderOptions as _RenderOptions } from '@testing-library/react';

import { AppStore } from '@/data-store/store';
import { StoreProvider } from '@/data-store/StoreProvider';
import * as messages from '@/i18n/en.json';
import { defaultLocale } from '@/i18n/routing';

import { AppProviders } from '@/app/providers';

export * from '@testing-library/react';

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface RenderOptions extends _RenderOptions {
  store?: AppStore;
}

export async function renderWithProviders(
  el: React.ReactElement,
  { store, ...renderOptions }: RenderOptions = {},
): Promise<RenderResult> {
  function Wrapper({ children }: PropsWithChildren): React.ReactElement {
    return (
      <StoreProvider store={store}>
        <NextIntlClientProvider messages={messages} locale={defaultLocale}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </StoreProvider>
    );
  }

  return render(el, { ...renderOptions, wrapper: Wrapper });
}
