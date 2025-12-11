import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { forCompLayer } from '@/styles/utils';

export const container = style(
  forCompLayer({
    display: 'inline-flex',
    alignItems: 'center',
  }),
);
export const icon = style(
  forCompLayer({
    display: 'inline',
    width: `calc(1em + ${cssVal.space.s2})`,
    height: `calc(1em + ${cssVal.space.s2})`,
  }),
);
export const amount = style(
  forCompLayer({
    fontWeight: cssVal.fontWeight.semibold,
  }),
);
export const suffix = style(
  forCompLayer({
    paddingLeft: cssVal.space.s4,
    fontSize: '66%',
  }),
);
