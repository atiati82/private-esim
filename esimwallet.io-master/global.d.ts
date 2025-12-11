import type { Payload } from 'payload';

// Expand extra matchers coming from js-dom (w/o this, the IDE complains)
import '@testing-library/jest-dom/vitest';

import en from '@/i18n/en.json';

import type { GtmEvent } from '@/app-analytics/gtm/gtm';

// Makes references to intl messages strictly typed, based on the shape of en.json
// Use everywhere IntlMessages as a type for them.
type Messages = typeof en;

/* eslint-disable no-var */
declare global {
  // Cached instance of Payload, set in getPayload() utility func
  var _payload: { payload: Payload | undefined; promise: Promise<Payload> } | undefined;

  // Google Tag Manager...
  var dataLayer: GtmEvent[];

  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
