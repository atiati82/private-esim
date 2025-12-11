import { globalStyle, style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';

// mx-auto max-w-3xl bg-white p-2 md:p-3
export const container = style([
  {
    'marginLeft': 'auto',
    'marginRight': 'auto',
    'marginTop': cssVal.space.base,
    'marginBottom': cssVal.space.base,
    '@media': {
      [cssVal.screen.sm]: {
        width: '24rem',
      },
    },
  },
]);

// 'flex w-full items-center border bg-muted p-2 outline-0 focus-within:ring-1 focus-within:ring-ring md:p-3.5'
export const popoverTrigger = style({
  width: '100%',
});

// THIS IS a bit MESSY:
// To make keyboard navigation work in the search, we visually overlay
// the INPUT from PopoverTrigger with the INPUT from PopoverContent.
// There seems to be no other way to achieve that, that's how Popover + Commands work.
//
// -mt-[3px] w-[20rem] border-transparent p-0 sm:w-[30rem] md:w-[42rem] lg:w-[46.5rem]
export const popoverContent = style({
  'width': `calc(100vw - 1.1rem)`,
  'marginTop': '-3.75rem',
  'marginLeft': '-0.45rem',
  'zIndex': 5,
  '@media': {
    [cssVal.screen.sm]: {
      width: '24.88rem',
      marginTop: '-3.7rem',
    },
  },
});

// Command container, with list of locations in it
// For Destination Search, since it's displayed on the main page
// and shows large Destination Cards, we want the max height a bit higher
// than the default (used on other popovers).
export const myLocationsList = style({});
globalStyle(`${myLocationsList} .command-list`, {
  maxHeight: '25rem',
});
// Add some separation from search input.
// Can't add it elsewhere, as it adds extra padding when empty command list container is rendered.
globalStyle(`${myLocationsList} .command-list:has(.command-item:first-child)`, {
  marginTop: cssVal.space.s1,
});

export const searchInput = style({
  height: '3rem',
  outline: 'none',
});

globalStyle(`${popoverContent} .${searchInput}`, {
  outline: '2px solid rgba(37, 99, 235, 0.6)',
  backgroundColor: 'rgba(23, 23, 23, 0.8)',
  color: 'rgba(255, 255, 255, 0.9)',
});
