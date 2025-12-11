import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { containerWithBorder, flexContainer } from '@/styles/layout.css';
import { link } from '@/styles/typography.css';

export const wrapper = style([
  flexContainer,
  containerWithBorder,
  {
    justifyContent: 'space-between',
    alignItems: 'start',
    padding: cssVal.space.base,
    marginBottom: cssVal.space.base,
    fontSize: cssVal.fontSize.sm,
  },
]);

export const columnEnd = style({
  textAlign: 'right',
});
export const orderEditLink = style([
  link,
  {
    fontSize: cssVal.fontSize.xs,
  },
]);

export const itemsLine = style([
  link,
  {
    fontWeight: cssVal.fontWeight.semibold,
  },
]);
export const orderId = style({
  display: 'block',
  fontSize: cssVal.fontSize.xs,
});
