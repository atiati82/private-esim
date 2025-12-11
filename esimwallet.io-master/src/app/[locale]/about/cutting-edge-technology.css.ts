import { style } from '@vanilla-extract/css';

import { aboutSectionWrap, subTitle } from '@/app/[locale]/about/about.css';
import { cssVal } from '@/styles/css-values';
import { pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const cuttingEdgeTechnologyContainer = style([pageContainer, aboutSectionWrap]);

export const cuttingEdgeTechnologySubTitle = style([subTitle]);

export const cuttingEdgeTechnologyDescription = style({
  fontSize: cssVal.fontSize.md,
  lineHeight: cssVal.lineHeight.dynamic,
});

export const dataInfo = style({
  'width': '100%',
  'display': 'grid',
  'gridTemplateColumns': 'repeat(1, 1fr)',
  'gap': cssVal.space.base,
  '@media': {
    [cssVal.screen.md]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [cssVal.screen.lg]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
});

export const cardDataInfo = style({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: vars.color.white,
  padding: cssVal.space.base,
  borderRadius: cssVal.radii.default,
});

export const cardDataInfoTitle = style({
  fontSize: cssVal.fontSize.md,
  fontWeight: cssVal.fontWeight.semibold,
});

export const noDataFound = style({
  color: vars.color.destructive.default,
});
