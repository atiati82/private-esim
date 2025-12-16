import { AppPublicUrl, PayloadAdminUrl } from '@/config';
import { RouterState } from '@/data-store/router/router';
import { isRegionId } from '@/data/region';
import { EsimProductsCollectionId } from '@/payload/collections';

/**
 * Known content pages
 *
 * @see urlForPage()
 */
export enum UrlForPage {
  Home = '/',
  GeneralTermsAndConditions = '/tcs',
  PrivacyPolicy = '/privacy-policy',
  OrderingPaymentPolicy = '/ordering-policy',
  ReturnsRefundsPolicy = '/returns-and-refunds',
  Blog = '/blog',
  AboutUs = '/about',
  ContactUs = '/contact',
  Faq = '/faq',
  StoreLocalEsim = '/#store',
  StoreRegionalEsim = '/regional-esim',
  StoreGlobalEsim = '/global-esim',
  ActivationGuide = '/activation-guide',
  WhyEsimWallet = '/why-esimwallet',
  CompatibleDevices = '/esim-compatible-devices',
  MyWallet = '/wallet',
}

export function urlForPage(url: UrlForPage): string {
  return `${AppPublicUrl}${url}`;
}

/**
 * Make URL to Local or Region or Global products (list)
 * @param locationSlug Destination slug, Region slug or `undefined` for Global listing
 */
export function urlForProductsList(locationSlug: string | undefined): string {
  if (isRegionId(locationSlug)) {
    return urlForRegionProductsList(locationSlug);
  } else if (locationSlug) {
    return urlForLocalProductsList(locationSlug);
  } else {
    return urlForGlobalProductsList();
  }
}
/**
 * Make URL to Local or Region or Global product
 * @param locationSlug Destination slug, Region slug or `undefined` for Global listing
 * @param esimProductSlug Product slug
 */
export function urlForProduct(locationSlug: string | undefined, esimProductSlug: string): string {
  return `${urlForProductsList(locationSlug)}/${esimProductSlug}`;
}

/**
 * Make URL for a destination page (Local eSIMs)
 */
export function urlForLocalProductsList(destinationSlug: string): string {
  return `/${DestinationEsimsUrlSegment}/${destinationSlug}`;
}
/**
 * Make URL for EsimProduct page (within given destination)
 */
export function urlForLocalProduct(destinationSlug: string, esimProductSlug: string): string {
  return `${urlForLocalProductsList(destinationSlug)}/${esimProductSlug}`;
}
export const DestinationEsimsUrlSegment = 'esim';

/**
 * Make URL for a region/continent page (Regional eSIMs)
 */
export function urlForRegionProductsList(regionSlug: string): string {
  return `/${RegionEsimsUrlSegment}/${regionSlug}`;
}
export function urlForRegionProduct(regionSlug: string, esimProductSlug: string): string {
  return `${urlForRegionProductsList(regionSlug)}/${esimProductSlug}`;
}
export const RegionEsimsUrlSegment = 'regional-esim'; // TODO: rename to `region-esim`

export function urlForGlobalProductsList(): string {
  return `/${GlobalEsimsUrlSegment}`;
}
export function urlForGlobalProduct(esimProductSlug: string): string {
  return `${urlForGlobalProductsList()}/${esimProductSlug}`;
}
export const GlobalEsimsUrlSegment = 'global-esim';

export function urlCmsForEsimProduct(id: string): string {
  return `${PayloadAdminUrl}/collections/${EsimProductsCollectionId}/${id}`;
}

/**
 * Customer Account, My Wallet urls
 */
export function urlForAccount(
  accountSubsection: MyAccountSections = '',
  extraParams?: UrlParams | null,
): string {
  const subUrl = accountSubsection ? '/' + accountSubsection : '';
  // These are pretty sensitive URLs, so prefix it with full host url
  return `${AppPublicUrl}/account${subUrl}${paramsToUrlSearchParams(extraParams)}`;
}
export type MyAccountSections = '' | 'login' | 'create' | 'verify' | 'password-reset';

export function urlForCart(): string {
  return `/${CartUrlSegment}`;
}

/**
 * URL to My Wallet section - or a specific order item in the Wallet
 */
export function urlForMyWallet(orderItemId?: string): string {
  return urlForOrderItem(orderItemId);
}
export function urlForOrderItem(orderItemId?: string): string {
  return `/${MyWalletUrlSegment}${orderItemId ? '/' + orderItemId : ''}`;
}
export const MyWalletUrlSegment = 'wallet';

export function urlForCheckout(transactionId?: string): string {
  return `/${CheckoutUrlSegment}${transactionId ? '/' + transactionId : ''}`;
}
export const CartUrlSegment = 'cart';
export const CheckoutUrlSegment = 'checkout';

/**
 * Page in My Account, transactions list history, for all transactions (orders) made by Customer
 */
export function urlForTransactions(transactionId?: string): string {
  return `${AppPublicUrl}/transactions${transactionId ? '/' + transactionId : ''}`;
}

/**
 * Build ?searchParams, ready to be appended to URL
 */
export function paramsToUrlSearchParams(params: RouterState['params'] | null | undefined): string {
  const keys = params ? Object.keys(params) : [];
  if (keys.length === 0) {
    return '';
  }

  const searchParams = new URLSearchParams();
  for (const key of keys) {
    const val = params?.[key]?.toString();
    if (val) {
      searchParams.append(key, val);
    }
  }

  const searchParamsStr = searchParams.toString();
  return searchParamsStr ? '?' + searchParamsStr : '';
}
export type UrlParams = Record<string, string | string[]>;

/**
 * Generates a URL for a blog post.
 * @param blogPostSlug The unique slug for the blog post.
 */
export function urlForBlogPost(blogPostSlug: string): string {
  return `${AppPublicUrl}/blog/${blogPostSlug}`;
}
/**
 * Generates a URL for a blog post preview.
 * @param blogPostSlug The unique slug for the blog post.
 */
export function urlForBlogPostPreview(blogPostSlug: string): string {
  return `${AppPublicUrl}/blog/preview/${blogPostSlug}`;
}
