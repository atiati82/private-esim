import { RouterState } from '@/data-store/router/router';
import { paramsToUrlSearchParams } from '@/lib/urls';

export type GtmEvent = {
  event: 'pageview'; // TODO: list supported event types;
  page: string; // url + ?allParams (ATM)
};

export function getGtmId(): string {
  return process.env.NEXT_PUBLIC_GTM_ID || 'GTM-not-set';
}

export function gtmSendPageView(
  path: RouterState['path'],
  urlParams?: RouterState['params'],
): GtmEvent | void {
  // Skip the empty path (might happen on initial page load)
  if (typeof window !== 'undefined' && path) {
    const paramsString = paramsToUrlSearchParams(urlParams);
    const event: GtmEvent = {
      event: 'pageview',
      page: path + paramsString,
    };
    window.dataLayer.push(event);
    return event;
  }
}
