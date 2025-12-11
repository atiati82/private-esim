import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { grid123Cols, pageContainer } from '@/styles/layout.css';

export const headlineContainer = style({
  backgroundImage: 'none',
});
export const latestPostsContainer = style([
  pageContainer,
  grid123Cols,
  {
    padding: cssVal.space.base,
  },
]);
