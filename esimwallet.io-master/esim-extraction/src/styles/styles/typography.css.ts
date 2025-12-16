import { style, StyleRule } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { spaceBetween } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';
import {
  forBaseLayer,
  forUtilsLayer,
  globalStyleBaseLayer,
  globalStyleUtilsLayer,
  rem,
} from '@/styles/utils';

export const fontSemibold = style(forUtilsLayer({ fontWeight: cssVal.fontWeight.semibold }));
export const fontBold = style(forUtilsLayer({ fontWeight: cssVal.fontWeight.bold }));

export const textAlignCenter = style(forUtilsLayer({ textAlign: 'center' }));
export const textAlignRight = style(forUtilsLayer({ textAlign: 'right' }));

export const textTiny = style(forUtilsLayer({ fontSize: cssVal.fontSize.tiny }));
export const textXs = style(forUtilsLayer({ fontSize: cssVal.fontSize.xs }));
export const textSm = style(forUtilsLayer({ fontSize: cssVal.fontSize.sm }));
export const textBase = style(forUtilsLayer({ fontSize: cssVal.fontSize.base }));
export const textMd = style(forUtilsLayer({ fontSize: cssVal.fontSize.md }));
export const textLg = style(forUtilsLayer({ fontSize: cssVal.fontSize.lg }));
export const textXl = style(forUtilsLayer({ fontSize: cssVal.fontSize.xl }));
export const textXl2 = style(forUtilsLayer({ fontSize: cssVal.fontSize.xl2 }));
export const textXl3 = style(forUtilsLayer({ fontSize: cssVal.fontSize.xl3 }));
export const textXl4 = style(forUtilsLayer({ fontSize: cssVal.fontSize.xl4 }));

export const textMuted = style(forUtilsLayer({ color: vars.color.muted.foreground }));
export const textDestructive = style(forUtilsLayer({ color: vars.color.destructive.default }));

/**
 * Used to display tiny Error codes in the alerts / flash messages
 */
export const textErrorCode = style({
  whiteSpace: 'nowrap',
  fontSize: cssVal.fontSize.tiny,
  fontWeight: cssVal.fontWeight.semibold,
  color: vars.color.destructive.darker,
});

// TODO: this is quite opinionated (spacing, bullet list padding etc...)
//  For now only used in the product cards, in about section...
export const textUlListContent = style([spaceBetween.y.s2, forUtilsLayer({})]);
globalStyleUtilsLayer(`${textUlListContent} > li`, {
  paddingLeft: rem(2),
  backgroundSize: cssVal.space.base,
  backgroundPosition: `${cssVal.space.s3} ${cssVal.space.s3}`,
  backgroundRepeat: 'no-repeat',
  backgroundImage:
    "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhYWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIiLz48L3N2Zz4=')",
});

export const lineClamp1 = style(
  forUtilsLayer({
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
  }),
);

export const linkStyles: StyleRule = {
  textDecoration: 'underline',
  textDecorationColor: vars.color.primary.lighter,
  textDecorationSkipInk: 'all',
  textDecorationStyle: 'dotted',
};
export const linkHoverStyles: StyleRule = {
  textDecorationColor: vars.color.primary.default,
  textDecorationSkipInk: 'none',
  textDecorationStyle: 'solid',
};
export const link = style(
  forBaseLayer({
    ...linkStyles,
    ':hover': linkHoverStyles,
  }),
);
export const links = style(forBaseLayer({}));
globalStyleBaseLayer(`${links} a`, linkStyles);
globalStyleBaseLayer(`${links} a:hover`, linkHoverStyles);

/**
 * Class with styled content inside.
 * Can be used to render standard content rendered as HTML from CMS.
 */
export const prose = style([links, forBaseLayer({})]);
globalStyleBaseLayer(`${prose} > * ~ *`, {
  marginTop: cssVal.space.s1,
});

globalStyleBaseLayer(`${prose} ul`, {
  marginLeft: cssVal.space.l1,
  marginTop: cssVal.space.base,
  marginBottom: cssVal.space.base,
  listStyleType: 'disc',
});
globalStyleBaseLayer(`${prose} > ol > li:has(> ol), .${prose} > ul > li:has(> ul)`, {
  listStyleType: 'none',
});

globalStyleBaseLayer(`${prose} ol`, {
  marginLeft: cssVal.space.l1,
  marginTop: cssVal.space.base,
  marginBottom: cssVal.space.base,
  listStyleType: 'decimal',
});

globalStyleBaseLayer(`${prose} li`, {
  marginBottom: cssVal.space.s1,
});

globalStyleBaseLayer(`${prose} ul ul`, {
  marginTop: 0,
  listStyleType: 'circle',
  marginLeft: cssVal.space.l2,
});

globalStyleBaseLayer(`${prose} ol ol`, {
  marginTop: 0,
  listStyleType: 'lower-alpha',
  marginLeft: cssVal.space.l2,
});

globalStyleBaseLayer(`${prose} ul ul ul`, {
  listStyleType: 'square',
  marginLeft: cssVal.space.l3,
});

globalStyleBaseLayer(`${prose} ol ol ol`, {
  listStyleType: 'lower-roman',
  marginLeft: cssVal.space.l3,
});

globalStyleBaseLayer(`${prose} blockquote`, {
  borderLeft: '0.25rem solid',
  borderColor: vars.color.primary.darker,
  padding: cssVal.space.base,
  margin: '0.2rem 0',
});

globalStyleBaseLayer(`${prose} table`, {
  width: '100%',
  borderCollapse: 'collapse',
  display: 'table',
  marginBottom: cssVal.space.base,
  fontSize: cssVal.fontSize.sm,
});
globalStyleBaseLayer(`${prose} tbody > tr`, {
  borderBottomWidth: 1,
  borderColor: vars.color.border,
});
globalStyleBaseLayer(`${prose} th`, {
  backgroundColor: vars.color.secondary.default,
});
globalStyleBaseLayer(`${prose} th, ${prose} td`, {
  padding: cssVal.space.s1,
  textAlign: 'left',
});
