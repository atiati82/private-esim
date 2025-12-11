import { style } from '@vanilla-extract/css';

import { cardVariants } from '@/components/ui.shadcn/card.css';
import { cssVal } from '@/styles/css-values';

export const productCardContainer = style({
  'width': '36rem',
  'marginBottom': cssVal.space.l3,
  '@media': {
    [cssVal.screen.smAndSmaller]: {
      width: 'auto',
    },
  },
});

export const miniCardBackground = style({
  'marginBottom': cssVal.space.base,
  'paddingTop': cssVal.space.l1,
  'paddingBottom': cssVal.space.l1,
  'borderRadius': cssVal.radii.medium,
  'backgroundImage': `url('/images/product-card-bg.jpeg')`,
  'backgroundRepeat': 'no-repeat',
  'backgroundSize': 'cover',
  '@media': {
    [cssVal.screen.xsAndSmaller]: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
});
export const miniCard = style({
  marginLeft: 'auto',
  marginRight: 'auto',
  selectors: {
    [`${cardVariants({ variant: 'default' })}&:hover`]: {
      borderColor: 'transparent', // remove the default :hover effect
    },
  },
});

export const accordion = style({
  width: '100%',
  marginTop: cssVal.space.base,
  marginBottom: cssVal.space.base,
});

export const topUpsCount = style({
  marginLeft: cssVal.space.s1,
  marginRight: 'auto',
});
