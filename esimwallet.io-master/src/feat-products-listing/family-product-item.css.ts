import { globalStyle, style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';

export const productItem = style({
  'width': '100%',
  'display': 'flex',
  'justifyContent': 'space-between',
  'fontSize': cssVal.fontSize.sm,
  'lineHeight': cssVal.lineHeight.interactive,
  'padding': `${cssVal.space.s2} ${cssVal.space.base}`,
  'outlineColor': vars.color.primary.default,
  'borderRadius': cssVal.radii.default,
  ':hover': {
    backgroundColor: vars.color.accent.lighter,
    outlineWidth: 1,
    outlineStyle: 'solid',
  },
});

export const productInfo = style({
  flex: '1 1 20%',
  display: 'flex',
  flexDirection: 'column',
  gap: cssVal.space.s3,
});
export const productInfoTitle = style({
  fontWeight: cssVal.fontWeight.bold,
  whiteSpace: 'nowrap',
});
export const productSubtitle = style({
  fontSize: cssVal.fontSize.xs,
});

export const productPricing = style({
  flex: '1 1 25%',
});
export const productPricingPerUnit = style({
  display: 'flex',
  marginTop: cssVal.space.s4,
  fontSize: cssVal.fontSize.xs,
});
globalStyle(`.${productPricingPerUnit} .currency-icon`, {
  width: '1em',
  height: '1em',
});
globalStyle(`.${productPricingPerUnit} .currency-amount`, {
  fontWeight: cssVal.fontWeight.normal,
});
export const productDiscount = style({
  flex: '0 1 15%',
  fontSize: cssVal.fontSize.tiny,
  fontWeight: cssVal.fontWeight.semibold,
});
export const productLinks = style({
  flex: '0 0 auto',
});
