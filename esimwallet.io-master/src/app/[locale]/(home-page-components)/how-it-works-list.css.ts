import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainer, gridNarrow12Cols, pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';
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
    background: vars.color.muted.default,
    border: `1px solid ${vars.color.border}`,
    borderRadius: cssVal.radii.default,
    marginBottom: cssVal.space.s1,
    aspectRatio: '3/2',
    minHeight: rem(15),
    width: '100%',
    selectors: {
      [`${howItWorksListContent}:hover &`]: {
        border: `1px solid ${vars.color.primary.default}`,
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
