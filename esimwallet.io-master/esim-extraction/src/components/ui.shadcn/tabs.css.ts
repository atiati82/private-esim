import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';
import { forCompLayer } from '@/styles/utils';

// 'inline-flex h-10 items-center justify-center rounded-md bg-muted
// p-1 text-muted-foreground'
export const tabsList = style(
  forCompLayer({
    display: 'inline-flex',
    padding: cssVal.space.s2,
    height: cssVal.space.l2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: cssVal.radii.default,
    backgroundColor: vars.color.muted.default,
  }),
);

// font-medium inline-flex items-center justify-center whitespace-nowrap
// rounded-sm px-3 py-1.5 text-sm
// ring-offset-background transition-all
// focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
// disabled:pointer-events-none disabled:opacity-50
// data-[state=active]:bg-background
// data-[state=active]:text-foreground
// data-[state=active]:shadow-sm
export const trigger = style(
  forCompLayer({
    // TODO
  }),
);

// mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
export const tabsContent = style(
  forCompLayer({
    // TODO
  }),
);
