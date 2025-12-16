import * as React from 'react';

import { cn, debugVariantInfo, isTruthy } from '@/lib/utils';

import { headlineVariants, HeadlineVariants } from '@/components/ui/Headline.css';

type HeadlineElType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

export type HeadlineProps = React.HTMLAttributes<HTMLHeadingElement> &
  HeadlineVariants & {
    /**
     * Render component as specified Hx tag - `h2` by default
     */
    as?: HeadlineElType;
  };

/**
 * `<Headline />` component renders h1, h2, h3... tags.
 *
 * ## General usage guidelines
 *
 * ### h1-large
 * 64px (700) - for (center-aligned) extra large titles on HP
 *
 * ### h1
 * 48px (700) - main (CTA) headline on home page, perhaps for content sub-pages, blog titles etc
 *
 * ### h1-small
 * 40px (500) - for (left-aligned) titles on HP
 *
 * ### h2-large
 * 32px (500) - headlines for sub-pages (Most Popular Destinations on subpage)
 *
 * ### h2
 * 24px (700) - **default headline** on HP, cards, My Account pages, activation pages, filters sections etc
 *
 * ### h2-small
 * 20px (500) - form top-level title/headline
 * <br />**NOTE:** it's the same size as h3, but with lighter weight
 *
 * ### h3
 * 20px (700) - eSIM card title, HP cards, HP wizard titles
 * <br />**NOTE:** often with accent color
 *
 * ### h4
 * 16px (500) (or 600, acc. to the design) - destination card title
 *
 * ### h5
 * 14px (700) - multi select tiles options
 * <br />**NOTE:** often with accent color
 *
 * ### h6-large
 * 10px (500) uppercase - product feature title (on product detail page)
 *
 * ### h6
 * 10px (500) - product card subtitle (provider/network name)
 * <br />**NOTE:** often with accent color
 */
const Headline = React.forwardRef<HTMLHeadingElement, HeadlineProps>(
  ({ className, as = 'h2', like, align, accent, ...props }, ref) => {
    const Comp = (isTruthy(as) && as) || 'h2';
    return (
      <Comp
        {...debugVariantInfo({ as, like, align, accent })}
        className={cn(headlineVariants({ like, align, accent }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Headline.displayName = 'Headline';

export { Headline };
