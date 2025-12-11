import { cssVal } from '@/styles/css-values';
import { globalStyleBaseLayer } from '@/styles/utils';

// Box sizing rules
globalStyleBaseLayer('*', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
  border: '0 solid transparent',
});
globalStyleBaseLayer('*::before, *::after', {
  boxSizing: 'border-box',
});

// Prevent font size inflation
globalStyleBaseLayer('html', {
  'scrollBehavior': 'smooth',
  'textSizeAdjust': 'none',
  'MozTextSizeAdjust': 'none',
  'WebkitTextSizeAdjust': 'none',
  'WebkitTapHighlightColor': 'transparent',

  // Slightly lower the base font size for smaller screens
  // so everything sized with 'rem' will nicely scale down.
  // Then, for medium and up, restore the base value (16px)
  'fontSize': '14px',
  '@media': {
    [cssVal.screen.sm]: { fontSize: '15px' },
    [cssVal.screen.md]: { fontSize: '16px' },
  },
});

// Set core body defaults
globalStyleBaseLayer('body', {
  minHeight: '100vh',
});

// Prevent text overflow in paragraphs, too
globalStyleBaseLayer('p', {
  overflowWrap: 'break-word',
});

// An elements that don't have a class get default styles
globalStyleBaseLayer('a', {
  textDecorationSkipInk: 'auto',
  textDecoration: 'none',
  color: 'currentColor',
});

// Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed
globalStyleBaseLayer('ul, ol', {
  listStyle: 'none',
});

// Make images easier to work with
globalStyleBaseLayer('img, video, canvas, svg, picture', {
  display: 'block', // usually you want them block... inline are more common for icons, and you'd use svg for that
  blockSize: 'auto',
  maxWidth: '100%', // Allow for fluid image sizing while maintaining aspect ratio governed by width/height attributes
  height: 'auto', // Allow for fluid image sizing while maintaining aspect ratio governed by width/height attributes
  maxInlineSize: '100%',
  verticalAlign: 'middle', // Remove phantom whitespace
  backgroundRepeat: 'no-repeat', // Prepare for LQIP technique
  backgroundSize: 'cover', // Prepare for LQIP technique
});

/**
 * Inherit fonts for inputs and buttons
 * And yes, inherit _all_ `font-*` properties
 */
globalStyleBaseLayer('form, button, input, textarea, select', {
  font: 'inherit',
  textTransform: 'none',
  backgroundColor: 'unset',
});

// Set shorter line heights on interactive elements
globalStyleBaseLayer('button, input', {
  lineHeight: 1.1,
});

// Set cursor to pointer for buttons and elements with role="button"
globalStyleBaseLayer(`button, [role='button']`, {
  cursor: 'pointer',
});

// Revert cursor to default for disabled elements
globalStyleBaseLayer(':disabled', {
  cursor: 'default',
});
globalStyleBaseLayer('[hidden]', {
  display: 'none',
});

// Make sure textarea without a rows attribute are not tiny
globalStyleBaseLayer('textarea:not([rows])', {
  minHeight: '8rem',
});

// Make sure tables don't have default spacing between cells
globalStyleBaseLayer('table', {
  textIndent: 0,
  borderColor: 'inherit',
  borderCollapse: 'collapse',
  borderSpacing: 0,
});

globalStyleBaseLayer('hr', {
  // TODO: some sensible defaults for HR
  height: 0,
  color: 'inherit',
  borderTopWidth: 1,
});

// Anything that has been anchored to should have extra scroll margin
globalStyleBaseLayer(':target', {
  scrollMarginBlock: '5ex',
});

globalStyleBaseLayer('*', {
  '@media': {
    '(prefersReducedMotion: reduce)': {
      animationDuration: '0.01ms !important',
      animationIterationCount: '1 !important',
      transitionDuration: '0.01ms !important',
      scrollBehavior: 'auto',
    },
  },
});

// Create a root stacking context
globalStyleBaseLayer('#root, #__next', {
  isolation: 'isolate',
});
