import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { spaceBetween } from '@/styles/layout.css';
import { forCompLayer } from '@/styles/utils';

export const buyButton = style(
  forCompLayer({
    width: '100%',
  }),
);

export const buyButtonPrice = style(
  forCompLayer({
    marginLeft: cssVal.space.s3,
  }),
);

export const buttons = style([
  spaceBetween.x.s1,
  {
    marginTop: cssVal.space.base,
    whiteSpace: 'nowrap',
  },
]);
