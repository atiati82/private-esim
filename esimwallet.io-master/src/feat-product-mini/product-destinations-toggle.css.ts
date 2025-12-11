import { style } from '@vanilla-extract/css';

import { avatarSizeVar } from '@/components/ui.shadcn/avatar.css';
import { cssVal } from '@/styles/css-values';
import { flexContainerC } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';
import { rem } from '@/styles/utils';

export const container = style({
  vars: {
    [avatarSizeVar]: rem(1.3),
  },
});
// Container when short version, in the lists, mini card...
export const containerShortView = style([
  flexContainerC,
  {
    fontWeight: cssVal.fontWeight.semibold,
    fontSize: cssVal.fontSize.xs,
    cursor: 'pointer',
  },
]);
// Container when isDetailsView=TRUE (i.e. when shown in the product single view page)
export const containerDetailsView = style({
  marginTop: cssVal.space.s2,
  marginBottom: cssVal.space.s3,
});

export const popoverTriggerButton = style([flexContainerC, {}]);

export const triggerFlagIcon = style({
  marginRight: cssVal.space.s4,
  outlineOffset: 2,
  outline: `1px solid transparent`,
  selectors: {
    [`${popoverTriggerButton}:hover &`]: {
      outlineColor: vars.color.primary.default,
    },
  },
});

export const triggerCountBadge = style({
  'position': 'relative',
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'height': `calc(${avatarSizeVar} + 4px)`,
  'minWidth': `calc(${avatarSizeVar} + 4px)`,
  'paddingLeft': cssVal.space.s3,
  'paddingRight': cssVal.space.s3,
  'marginRight': cssVal.space.s4,
  'borderRadius': cssVal.radii.large,
  'borderColor': vars.color.background,
  'borderWidth': 2,
  'color': vars.color.primary.foreground,
  'backgroundColor': vars.color.primary.default,
  'fontSize': cssVal.fontSize.tiny,
  'fontWeight': cssVal.fontWeight.bold,
  'outlineOffset': 0,
  'outline': `1px solid transparent`,
  ':hover': {
    outlineColor: vars.color.primary.default,
  },
});
export const triggerCountBadgeAsSuffix = style({
  marginLeft: `-${cssVal.space.s1}`,
});
export const triggerCountBadgeDetailsView = style({
  'marginLeft': cssVal.space.s5,
  'marginRight': cssVal.space.s5,
  'paddingLeft': cssVal.space.s2,
  'paddingRight': cssVal.space.s2,
  'fontSize': cssVal.fontSize.xs,
  'color': vars.color.foreground,
  'backgroundColor': vars.color.accent.default,
  ':hover': {
    color: vars.color.primary.foreground,
    backgroundColor: vars.color.primary.default,
  },
});
export const triggerCountBadgeInPopoverContent = style({
  // Reset :hover state to default colors... since here the badge is no longer clickable
  ':hover': {
    color: vars.color.foreground,
    backgroundColor: vars.color.accent.default,
    outlineColor: 'transparent',
  },
});

export const popoverContentSeparator = style({
  marginLeft: `-${cssVal.space.base}`,
  marginRight: `-${cssVal.space.base}`,
  marginBottom: 0,
  width: 'auto',
});

// Command container, with list of locations in it
export const locationsList = style({
  marginTop: 0,
});
