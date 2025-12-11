import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { gridNarrow12Cols, narrowPageContainer, pageContainerWidthVar } from '@/styles/layout.css';

export const pageWrapper = style([
  narrowPageContainer,
  {
    vars: {
      [pageContainerWidthVar]: '48rem',
    },
  },
]);

export const headline = style({
  marginBottom: cssVal.space.base,
  textAlign: 'center',
});

export const cardsGrid = style([gridNarrow12Cols]);
export const cardGridEl = style({
  width: 'auto',
});
