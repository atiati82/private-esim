import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { grid123Cols, pageContainer } from '@/styles/layout.css';

export const latestPostsSection = style({
  background:
    'linear-gradient(180deg, rgba(10, 10, 10, 0.95) 0%, rgba(23, 23, 23, 0.6) 50%, rgba(10, 10, 10, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  paddingTop: cssVal.space.l2,
  paddingBottom: cssVal.space.l2,
});

export const headlineContainer = style({
  backgroundImage: 'none',
  marginTop: 0,
  marginBottom: cssVal.space.l1,
  color: 'rgba(255, 255, 255, 0.95)',
});
export const latestPostsContainer = style([
  pageContainer,
  grid123Cols,
  {
    padding: cssVal.space.base,
  },
]);
