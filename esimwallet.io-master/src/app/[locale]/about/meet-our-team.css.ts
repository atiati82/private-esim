import { style } from '@vanilla-extract/css';

import { aboutSectionWrap, subTitle } from '@/app/[locale]/about/about.css';
import { cssVal } from '@/styles/css-values';
import { pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const meetOurTeamContainer = style([pageContainer, aboutSectionWrap]);

export const meetOurTeamSubTitle = style([subTitle]);

export const teamMemberList = style({
  'display': 'none',
  '@media': {
    [cssVal.screen.md]: {
      display: 'flex',
      gap: cssVal.space.l1,
      justifyContent: 'start',
      alignItems: 'center',
      overflowX: 'auto',
      width: '100%',
    },
  },
});

export const teamMemberWrap = style({
  cursor: 'pointer',
  borderRadius: cssVal.radii.medium,
  padding: cssVal.space.s1,
});

export const selected = style({
  borderColor: vars.color.primary.default,
});

export const teamMember = style({
  'display': 'flex',
  'flexDirection': 'column',
  'gap': cssVal.space.l1,
  '@media': {
    [cssVal.screen.md]: {
      display: 'none',
    },
  },
});

export const teamMemberWrapMobile = style({
  display: 'flex',
  flexDirection: 'column',
  gap: cssVal.space.base,
});

export const teamMemberContent = style({
  'display': 'none',
  '@media': {
    [cssVal.screen.md]: {
      display: 'flex',
      gap: cssVal.space.base,
      backgroundColor: vars.color.white,
      padding: cssVal.space.base,
      borderRadius: cssVal.radii.large,
      width: '100%',
    },
  },
});

export const teamMemberContentMobile = style({
  'display': 'flex',
  'flexDirection': 'column',
  'gap': cssVal.space.s1,
  '@media': {
    [cssVal.screen.md]: {
      display: 'none',
    },
  },
});

export const teamMemberContentNameRole = style({
  width: '15%',
  display: 'flex',
  flexDirection: 'column',
  gap: cssVal.space.s1,
});

export const teamMemberName = style({
  fontSize: cssVal.fontSize.xl,
  fontWeight: cssVal.fontWeight.bold,
});

export const teamMemberRole = style({
  fontSize: cssVal.fontSize.base,
  fontWeight: cssVal.fontWeight.normal,
});

export const teamMemberDescription = style({
  'width': '100%',
  'fontSize': cssVal.fontSize.base,
  '@media': {
    [cssVal.screen.md]: {
      width: '40%',
    },
  },
});
