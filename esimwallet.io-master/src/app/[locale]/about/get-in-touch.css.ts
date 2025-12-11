import { style } from '@vanilla-extract/css';

import { aboutSectionWrap, subTitle } from '@/app/[locale]/about/about.css';
import { cssVal } from '@/styles/css-values';
import { pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const getInTouchContainer = style([pageContainer, aboutSectionWrap]);

export const getInTouchTitle = style({
  fontSize: cssVal.fontSize.xl3,
});

export const getInTouchSubTitle = style([subTitle]);

export const formWrapper = style({
  'width': '100%',
  'backgroundColor': vars.color.white,
  'padding': cssVal.space.l1,
  'display': 'flex',
  'flexDirection': 'column',
  'gap': cssVal.space.l3,

  '@media': {
    [cssVal.screen.md]: {
      display: 'flex',
      flexDirection: 'row',
      padding: cssVal.space.l2,
    },
  },
});

export const formContent = style({
  'width': '100%',
  '@media': {
    [cssVal.screen.md]: {
      width: '50%',
    },
  },
});

export const formMessageImage = style({
  'backgroundColor': vars.color.primary.foreground,
  'padding': cssVal.space.l2,
  'borderRadius': cssVal.radii.default,
  'display': 'none',
  '@media': {
    [cssVal.screen.md]: {
      display: 'inline-block',
    },
  },
});

export const buttonContactUs = style({
  width: '100%',
});
