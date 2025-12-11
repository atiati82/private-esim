import type React from 'react';

import { Locale } from '@/i18n/routing';

/**
 * Next.js build process seems to have some validation where all page params
 * need to be of `SegmentParams` type. But Next.js doesn't export it? Strange...
 */
export type SegmentParams = { [param: string]: string | string[] | undefined };

export interface RootPageParams extends SegmentParams {
  locale: Locale;
}

export interface RootPageArgs {
  params: Promise<RootPageParams>;
}
export interface RootLayoutArgs extends RootPageArgs {
  children: React.ReactNode;
}

/**
 * Generic HTML element props, to use on default React.FC function components
 */
export interface HTMLElementProps<ElementType extends HTMLElement = HTMLDivElement>
  extends React.HTMLAttributes<ElementType> {}
