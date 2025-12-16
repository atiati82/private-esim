import { getRequestConfig } from 'next-intl/server';
import merge from 'lodash/merge';

import { defaultLocale, Locale, siteLocales } from './routing';

type RequestConfig = { messages: IntlMessages };

export async function loadMessagesWithFallback(locale: Locale): Promise<IntlMessages> {
  // Turbopack as for now has some issues with loading dynamic .json files...
  const defaultMessages: IntlMessages = (await import(`./en.json`)).default;

  let messages = {} as IntlMessages;
  if (locale !== defaultLocale) {
    switch (locale) {
      case 'es':
        messages = (await import(`./es.json`)).default as IntlMessages;
        break;
    }
  }

  return merge({}, defaultMessages, messages);
}

const createRequestConfig = async ({ requestLocale }: { requestLocale: Promise<string | undefined> }): Promise<RequestConfig & { locale: string }> => {
  let locale = await requestLocale;

  if (!locale || !siteLocales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: await loadMessagesWithFallback(locale as Locale)
  };
};

export default getRequestConfig(createRequestConfig);
