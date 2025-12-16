import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';
import { globalStyleBaseLayer } from '@/styles/utils';

globalStyleBaseLayer('body', {
  fontFamily: cssVal.font.base,
  fontWeight: cssVal.fontWeight.normal,
  lineHeight: cssVal.lineHeight.dynamic,
  // lineHeight: cssVal.lineHeight.default,
  WebkitFontSmoothing: 'antialiased', // Improve text rendering on macOS
  MozOsxFontSmoothing: 'grayscale', // Improve text rendering on older Firefox
  textRendering: 'optimizeLegibility', // Enhance legibility of text
});

// Balance text wrapping on headings
globalStyleBaseLayer('h1, h2, h3, h4, h5, h6', {
  textWrap: 'balance',
  overflowWrap: 'break-word',
  lineHeight: cssVal.lineHeight.dynamic,
});

globalStyleBaseLayer('.h1-large', {
  fontSize: cssVal.fontSize.xl4,
});
globalStyleBaseLayer('h1, .h1', {
  fontSize: cssVal.fontSize.xl3,
});
globalStyleBaseLayer('.h1-small', {
  fontSize: cssVal.fontSize.xl2,
  fontWeight: cssVal.fontWeight.semibold,
});
globalStyleBaseLayer('.h2-large', {
  fontSize: cssVal.fontSize.xl,
  fontWeight: cssVal.fontWeight.semibold,
});
globalStyleBaseLayer('h2, .h2', {
  fontSize: cssVal.fontSize.lg,
});
globalStyleBaseLayer('.h2-small', {
  fontSize: cssVal.fontSize.md,
  fontWeight: cssVal.fontWeight.semibold,
});
globalStyleBaseLayer('h3, .h3', {
  fontSize: cssVal.fontSize.md,
});
globalStyleBaseLayer('h4, .h4', {
  fontSize: cssVal.fontSize.base,
  fontWeight: 600,
});
globalStyleBaseLayer('h5, .h5', {
  fontSize: cssVal.fontSize.sm,
});
globalStyleBaseLayer('.h6-large', {
  fontSize: cssVal.fontSize.tiny,
  fontWeight: cssVal.fontWeight.semibold,
  textTransform: 'uppercase',
  opacity: 0.5,
});
globalStyleBaseLayer('h6, .h6', {
  fontSize: cssVal.fontSize.tiny,
  fontWeight: cssVal.fontWeight.semibold,
});

globalStyleBaseLayer('pre, code', {
  fontFamily: cssVal.font.mono,
  backgroundColor: vars.color.muted.default,
});
globalStyleBaseLayer(`pre`, {
  display: 'block',
  whiteSpace: 'pre',
  overflowX: 'auto',
  padding: `${cssVal.space.s1} ${cssVal.space.base}`,
  fontSize: cssVal.fontSize.sm,
  borderRadius: cssVal.radii.default,
});
globalStyleBaseLayer('code', {
  display: 'inline-block',
  whiteSpace: 'pre-wrap',
  fontSize: 'inherit',
  paddingLeft: cssVal.space.s2,
  paddingRight: cssVal.space.s2,
  borderRadius: cssVal.radii.small,
});
