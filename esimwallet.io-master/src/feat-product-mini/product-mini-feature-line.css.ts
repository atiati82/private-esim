import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerJbC } from '@/styles/layout.css';

export const container = style([flexContainerJbC, {}]);
export const icon = style({
  width: '1.4em',
  marginRight: cssVal.space.s2,
});
export const title = style([{}]);
export const value = style([
  {
    marginLeft: 'auto',
  },
]);
export const valueSuffix = style([{}]);
