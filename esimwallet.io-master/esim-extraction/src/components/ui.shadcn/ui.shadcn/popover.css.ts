import { style } from '@vanilla-extract/css';

import { enterAnimationStyles, exitAnimationStyles } from '@/styles/animations/rules';
import { cssVal } from '@/styles/css-values';
import { containerWithBorder } from '@/styles/layout.css';
import { forCompLayer } from '@/styles/utils';

export const popoverContent = style([
  containerWithBorder,
  forCompLayer({
    zIndex: cssVal.zIndex.popover,
    padding: cssVal.space.base,
    minWidth: cssVal.space.l5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: cssVal.radii.medium,
    backgroundColor: 'rgba(23, 23, 23, 0.85)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    selectors: {
      '&[data-state=open]': enterAnimationStyles,
      '&[data-state=closed]': exitAnimationStyles,
    },
  }),
]);
