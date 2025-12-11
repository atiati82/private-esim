import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerJbC, grid234Cols } from '@/styles/layout.css';

export const headlineContainer = style([
  flexContainerJbC,
  {
    marginTop: cssVal.space.l1,
    marginBottom: cssVal.space.l1,
  },
]);

export const cardsGrid = style([grid234Cols]);
export const cardGridEl = style({
  width: 'auto',
});
