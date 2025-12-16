import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { pageContainer } from '@/styles/layout.css';

export const pageWrapper = style([
  pageContainer,
  {
    display: 'flex',
  },
]);

export const pageFilter = style({
  display: 'none',
});
export const pageContent = style({
  'width': '100%',
  'marginLeft': 'auto',
  'marginRight': 'auto',
  '@media': {
    [cssVal.screen.md]: {
      maxWidth: 500,
    },
    [cssVal.screen.lg]: {},
  },
});
