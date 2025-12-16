import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainer, gridNarrow12Cols, pageContainer } from '@/styles/layout.css';
import { rem } from '@/styles/utils';

export const howItWorksListWrapper = style([
  pageContainer,
  gridNarrow12Cols,
  {
    'margin': `${cssVal.space.s1} 0`,
    'columnGap': cssVal.space.l1,
    'rowGap': cssVal.space.l2,
    '@media': {
      [cssVal.screen.smAndSmaller]: {
        columnGap: cssVal.space.base,
        rowGap: cssVal.space.l1,
      },
    },
  },
]);

export const howItWorksListContent = style([
  flexContainer,
  {
    width: '100%',
    flexDirection: 'column',
    gap: cssVal.space.s2,
  },
]);

export const howItWorksListCardWrapper = style([
  flexContainer,
  {
    justifyContent: 'center',
    background: 'rgba(23, 23, 23, 0.6)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: cssVal.radii.default,
    marginBottom: cssVal.space.s1,
    aspectRatio: '3/2',
    minHeight: rem(15),
    width: '100%',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    selectors: {
      [`${howItWorksListContent}:hover &`]: {
        border: '1px solid rgba(37, 99, 235, 0.5)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 30px rgba(37, 99, 235, 0.2)',
      },
    },
  },
]);

export const howItWorksListCardImage = style({
  objectFit: 'contain',
  padding: cssVal.space.l2,
});

export const howItWorksListCardImageChoosePlan = style({
  objectFit: 'contain',
  padding: `${cssVal.space.l2} ${cssVal.space.l2} 0`,
});

export const howItWorksSubtitle = style({
  fontSize: cssVal.fontSize.md,
  lineHeight: cssVal.lineHeight.dynamic,
  padding: `0 ${cssVal.space.l1}`,
});
