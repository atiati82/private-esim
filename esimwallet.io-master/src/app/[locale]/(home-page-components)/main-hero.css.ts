import { keyframes, style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { pageContainer, spaceBetween } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

// Animated gradient orb keyframes
const floatOrb = keyframes({
  '0%, 100%': { transform: 'translate(-50%, 0) scale(1)' },
  '50%': { transform: 'translate(-50%, -20px) scale(1.05)' },
});

const pulseGlow = keyframes({
  '0%, 100%': { opacity: 0.6 },
  '50%': { opacity: 0.9 },
});

export const heroWrapper = style({
  'position': 'relative',
  'height': 'auto',
  'background':
    'linear-gradient(180deg, hsl(0, 0%, 4%) 0%, hsl(0, 0%, 7%) 50%, hsl(0, 0%, 4%) 100%)',
  'overflow': 'hidden',
  'color': vars.color.white,
  // Primary blue orb
  '::before': {
    content: '""',
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '400px',
    background:
      'radial-gradient(ellipse, rgba(37, 99, 235, 0.4) 0%, rgba(37, 99, 235, 0.1) 40%, transparent 70%)',
    pointerEvents: 'none',
    filter: 'blur(60px)',
    animation: `${floatOrb} 8s ease-in-out infinite, ${pulseGlow} 4s ease-in-out infinite`,
  },
  // Secondary teal orb
  '::after': {
    content: '""',
    position: 'absolute',
    bottom: '10%',
    left: '30%',
    width: '400px',
    height: '300px',
    background:
      'radial-gradient(ellipse, rgba(56, 189, 248, 0.3) 0%, rgba(56, 189, 248, 0.1) 40%, transparent 70%)',
    pointerEvents: 'none',
    filter: 'blur(80px)',
    animation: `${floatOrb} 10s ease-in-out infinite reverse`,
  },
  '@media': {
    [cssVal.screen.md]: {
      height: '630px',
    },
  },
});

export const heroContainer = style([
  pageContainer,
  spaceBetween.y.base,
  {
    'position': 'relative',
    'paddingTop': cssVal.space.l2,
    'paddingBottom': cssVal.space.l1,
    'textAlign': 'center',
    'zIndex': 2,
    '@media': {
      [cssVal.screen.xsAndSmaller]: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  },
]);

export const headline = style({
  padding: `0 ${cssVal.space.base}`,
});

export const subtitle = style({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: cssVal.fontSize.lg,
  fontWeight: cssVal.fontWeight.light,
  lineHeight: cssVal.lineHeight.dynamic,
  padding: `0 ${cssVal.space.base}`,
});

export const badge = style([
  spaceBetween.x.s3,
  {
    width: 'fit-content',
    background: 'rgba(37, 99, 235, 0.15)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(37, 99, 235, 0.3)',
    justifySelf: 'center',
    padding: `${cssVal.space.s5} ${cssVal.space.s1}`,
    borderRadius: cssVal.radii.large,
    fontSize: cssVal.fontSize.xs,
    margin: 'auto',
    boxShadow: '0 0 20px rgba(37, 99, 235, 0.2)',
  },
]);
