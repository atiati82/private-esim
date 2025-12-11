import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerCC } from '@/styles/layout.css';
import { pxToRem } from '@/styles/utils';

export const blogPostInfoShareContainer = style([flexContainerCC, { gap: cssVal.space.s5 }]);
export const blogPostInfoShareButton = style({
  height: 'auto',
  padding: cssVal.space.s5,
});
export const blogPostInfoShareIcon = style({
  width: pxToRem(24),
  height: pxToRem(24),
});
