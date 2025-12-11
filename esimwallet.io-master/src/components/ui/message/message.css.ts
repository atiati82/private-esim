import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { prose } from '@/styles/typography.css';
import { forCompLayer } from '@/styles/utils';

export const messageWrapper = style(
  forCompLayer({
    marginTop: cssVal.space.base,
    marginBottom: cssVal.space.base,
  }),
);

export const description = style([prose, forCompLayer({})]);
