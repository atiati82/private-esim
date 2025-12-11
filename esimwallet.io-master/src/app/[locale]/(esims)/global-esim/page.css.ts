import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { narrowPageContainer } from '@/styles/layout.css';

export const pageWrapper = style([narrowPageContainer, {}]);

export const headline = style({
  marginBottom: cssVal.space.base,
  textAlign: 'center',
});
