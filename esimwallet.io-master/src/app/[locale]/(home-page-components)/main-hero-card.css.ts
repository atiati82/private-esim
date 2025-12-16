import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { rem } from '@/styles/utils';

export const mainCardHeroImage = style({
  'display': 'none',
  'width': rem(28),
  'height': 'auto',
  'position': 'absolute',
  'boxShadow': '0 0 100px 30px rgba(37, 99, 235, 0.35), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  'background':
    'linear-gradient(135deg, rgba(23, 23, 23, 0.9) 0%, rgba(38, 38, 38, 0.8) 50%, rgba(23, 23, 23, 0.9) 100%)',
  'backdropFilter': 'blur(20px)',
  'WebkitBackdropFilter': 'blur(20px)',
  'border': '1px solid rgba(255, 255, 255, 0.1)',
  'borderRadius': cssVal.radii.large,
  'margin': 'auto',
  'left': '50%',
  'transform': 'translateX(-50%)',
  'zIndex': 2,
  '@media': {
    [cssVal.screen.md]: {
      display: 'block',
    },
  },
});

export const mainHeroImage = style({
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: cssVal.radii.large,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
});
