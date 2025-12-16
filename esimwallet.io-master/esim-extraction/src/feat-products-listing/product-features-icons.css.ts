import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';
import { rem } from '@/styles/utils';

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: cssVal.space.s1,
});

export const providerInfo = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: cssVal.fontSize.sm,
});
export const providerLogo = style({
  width: rem(1.2),
  height: rem(1.2),
  marginLeft: cssVal.space.s3,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundBlendMode: 'darken',
  backgroundColor: vars.color.muted.default,
});
export const providerTitle = style({
  whiteSpace: 'nowrap',
  fontWeight: cssVal.fontWeight.semibold,
});
