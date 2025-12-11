import { style } from '@vanilla-extract/css';

import { aboutSectionWrap, subTitle } from '@/app/[locale]/about/about.css';
import { cssVal } from '@/styles/css-values';
import { pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const ourCoreValuesContainer = style([pageContainer, aboutSectionWrap]);

export const ourCoreValuesSubTitle = style([subTitle]);

export const ourCoreValuesGrid = style({
  'display': 'grid',
  'gridTemplateColumns': 'repeat(1, 1fr)',
  'gap': cssVal.space.l1,
  'width': '100%',
  'marginTop': cssVal.space.base,
  '@media': {
    [cssVal.screen.md]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
});

export const ourCoreValuesItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: cssVal.space.s1,
  padding: cssVal.space.base,
  backgroundColor: vars.color.white,
  borderRadius: cssVal.radii.default,
});

export const valuesItemIcon = style({
  display: 'flex',
  alignItems: 'center',
  gap: cssVal.space.s1,
});

export const valuesItemTitle = style({
  fontSize: cssVal.fontSize.lg,
  fontWeight: cssVal.fontWeight.semibold,
});

export const valuesItemDescription = style({
  fontSize: cssVal.fontSize.base,
});
