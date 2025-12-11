import { globalStyle, style } from '@vanilla-extract/css';

import { avatarSizeVar } from '@/components/ui.shadcn/avatar.css';
import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';

export const wrapper = style({
  paddingTop: cssVal.space.s1,
  paddingBottom: cssVal.space.s1,
  paddingLeft: cssVal.space.base,
  paddingRight: cssVal.space.base,
  borderRadius: cssVal.radii.medium,
  backgroundColor: vars.color.muted.default,
});
export const rowMain = style({
  display: 'flex',
  justifyContent: 'space-between',
});
export const row2nd = style([
  rowMain,
  {
    fontSize: cssVal.fontSize.xs,
  },
]);

export const familyInfo = style({
  flex: '1 1 auto',
  marginTop: cssVal.space.s1,
});
export const priceWrapper = style({
  position: 'relative',
  textAlign: 'right',
});
export const priceFromTitle = style({
  display: 'block',
  fontSize: cssVal.fontSize.tiny,
  fontWeight: cssVal.fontWeight.semibold,
  lineHeight: cssVal.lineHeight.interactive,
  opacity: 0.5,
});
globalStyle(`.${priceWrapper} .currency-amount`, {
  fontSize: cssVal.fontSize.md,
  fontWeight: cssVal.fontWeight.bold,
  color: vars.color.foregroundAccent,
});
globalStyle(`.${priceWrapper} .currency-amount-suffix`, {
  position: 'absolute',
  right: 0,
  bottom: `-${cssVal.space.base}`,
});

export const destinationsInfo = style({
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
});
export const destinationsInfoToggle = style({
  vars: {
    [avatarSizeVar]: cssVal.space.base,
  },
  marginLeft: cssVal.space.s3,
});
