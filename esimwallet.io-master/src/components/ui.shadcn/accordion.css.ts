import { style } from '@vanilla-extract/css';

import {
  accordionCloseAnimationStyles,
  accordionOpenAnimationStyles,
} from '@/styles/animations/rules';
import { cssVal } from '@/styles/css-values';
import { spaceBetween } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const accordionItem = style({
  borderWidth: 1,
  borderColor: vars.color.border,
  borderRadius: cssVal.radii.medium,
  backgroundColor: vars.color.background,
  selectors: {
    '& ~ &': {
      marginTop: cssVal.space.base,
    },
  },
});

export const accordionTrigger = style([
  'h4',
  {
    'display': 'flex',
    'flex': '1 1 0%',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'padding': cssVal.space.base,
    ':hover': {
      textDecoration: 'underline',
    },
  },
]);

export const accordionTriggerIcon = style({
  width: cssVal.space.base,
  height: cssVal.space.base,
  flexShrink: 0,
  transitionProperty: 'transform',
  transitionDuration: '0.2s',
  selectors: {
    '[data-state=open] > &': {
      transform: 'rotate(180deg)',
    },
  },
});

export const accordionContent = style({
  overflow: 'hidden',
  fontSize: cssVal.fontSize.sm,
  selectors: {
    '&[data-state=open]': accordionOpenAnimationStyles,
    '&[data-state=closed]': accordionCloseAnimationStyles,
  },
});

export const accordionContentInside = style([
  spaceBetween.y.s1,
  {
    padding: cssVal.space.base,
    paddingTop: 0,
  },
]);
