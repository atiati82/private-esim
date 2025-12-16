import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { containerWithBorder, flexContainer } from '@/styles/layout.css';
import { link } from '@/styles/typography.css';

export const headline = style({
  marginBottom: cssVal.space.s2,
});
export const flashMessage = style({
  marginBottom: cssVal.space.l1,
});

export const wrapper = style([
  flexContainer,
  containerWithBorder,
  {
    justifyContent: 'space-between',
    alignItems: 'start',
    padding: cssVal.space.base,
    marginTop: cssVal.space.base,
    marginBottom: cssVal.space.base,
    fontSize: cssVal.fontSize.sm,
  },
]);

export const columnEnd = style({
  textAlign: 'right',
});

export const itemsLine = style([
  link,
  {
    display: 'block',
    fontWeight: cssVal.fontWeight.semibold,
  },
]);
