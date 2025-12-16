import { style } from '@vanilla-extract/css';

import { easeInOutCubic, easeOutCubic, keyframesSpin } from '@/styles/animations/rules';
import { forBaseLayer } from '@/styles/utils';

export const animSpinner = style(
  forBaseLayer({
    animation: `1s cubic-bezier(0.18,0.89,0.32,1.27) infinite ${keyframesSpin}`,
  }),
);

export const transitionAll = style(
  forBaseLayer({
    transitionProperty: 'all',
    transitionTimingFunction: easeInOutCubic,
    transitionDuration: '0.15s',
  }),
);

export const transitionBgColors = style(
  forBaseLayer({
    transitionProperty: 'background-color, border-color, outline-color, fill, stroke',
    transitionDuration: '0.1s',
    transitionTimingFunction: easeOutCubic,
  }),
);
export const transitionTextBgColors = style(
  forBaseLayer({
    transitionProperty:
      'color, text-shadow, background-color, border-color, outline-color, fill, stroke',
    transitionDuration: '0.1s',
    transitionTimingFunction: easeOutCubic,
  }),
);
