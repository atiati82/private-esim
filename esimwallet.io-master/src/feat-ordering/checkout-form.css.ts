import { globalStyle, style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { links } from '@/styles/typography.css';

export const form = style({
  padding: 0,
  width: '100%',
});

export const formItemLegalAgreement = style([
  links,
  {
    marginTop: cssVal.space.l1,
  },
]);
globalStyle(`${formItemLegalAgreement} strong`, {
  fontWeight: cssVal.fontWeight.semibold,
});

export const submitButton = style({
  width: '100%',
  marginBottom: cssVal.space.base,
});
globalStyle(`${submitButton} .currency-formatter`, {
  marginLeft: cssVal.space.s1,
});
