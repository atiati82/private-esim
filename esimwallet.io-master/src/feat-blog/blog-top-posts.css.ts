import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainer } from '@/styles/layout.css';

export const blogTopPostContainer = style({});
export const blogTopPostContent = style([
  flexContainer,
  {
    flexDirection: 'column',
    gap: cssVal.space.base,
    marginTop: cssVal.space.base,
  },
]);
