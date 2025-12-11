import { style } from '@vanilla-extract/css';

import { enterAnimationStyles, exitAnimationStyles } from '@/styles/animations/rules';
import { cssVal } from '@/styles/css-values';
import { containerWithBorder } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';
import { forCompLayer } from '@/styles/utils';

export const popoverContent = style([
  containerWithBorder,
  forCompLayer({
    zIndex: cssVal.zIndex.popover,
    padding: cssVal.space.base,
    minWidth: cssVal.space.l5,
    borderWidth: 1,
    borderColor: vars.color.border,
    borderRadius: cssVal.radii.medium,
    backgroundColor: vars.color.background,
    boxShadow: vars.shadow.compact,
    selectors: {
      '&[data-state=open]': enterAnimationStyles,
      '&[data-state=closed]': exitAnimationStyles,
    },
  }),
]);
