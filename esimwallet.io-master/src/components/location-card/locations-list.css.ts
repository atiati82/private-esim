import { globalStyle, style } from '@vanilla-extract/css';

import { avatarSizeVar } from '@/components/ui.shadcn/avatar.css';
import { cssVal } from '@/styles/css-values';

export const command_base = style({});
export const command_defaultVariant = style({});
export const command_miniVariant = style({});

export const commandItem = style({});

export const commandItemLocationCard = style({
  width: '100%',
  borderWidth: 0,
  backgroundColor: 'transparent',
});
export const commandItemLocationCard_defaultVariant = style({
  paddingTop: cssVal.space.s1,
  paddingBottom: cssVal.space.s1,
});
globalStyle(`${commandItemLocationCard_defaultVariant} .card-image`, {
  vars: { [avatarSizeVar]: cssVal.space.l2 },
});

export const commandItemLocationCard_miniVariant = style({
  padding: 0,
});
globalStyle(`${commandItemLocationCard_miniVariant} .card-image`, {
  vars: { [avatarSizeVar]: '1.3rem' },
});

globalStyle(`${commandItemLocationCard_miniVariant} .card-title`, {
  fontWeight: cssVal.fontWeight.normal,
  fontSize: cssVal.fontSize.sm,
});
globalStyle(`${commandItemLocationCard_miniVariant} .card-subtitle`, {
  display: 'none',
});
