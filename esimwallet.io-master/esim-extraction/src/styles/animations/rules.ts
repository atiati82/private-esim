import { type StyleRule } from '@vanilla-extract/css';

export const keyframesSpin = 'spin';

export const keyframesEnter = 'enter';
export const keyframesExit = 'exit';

export const keyframesAccordionOpen = 'accordion-down';
export const keyframesAccordionClose = 'accordion-up';

/**
 * For a nice generator of animation timing functions, see:
 * @url https://easings.co
 */
export const easeInOutCubic = 'cubic-bezier(0.65,0.05,0.36,1)';
export const easeOutCubic = 'cubic-bezier(0.22,0.61,0.36,1)';

export const enterAnimationStyles: StyleRule = {
  animationName: keyframesEnter,
  animationDuration: '0.1s',
  animationTimingFunction: easeOutCubic,
};
export const exitAnimationStyles: StyleRule = {
  animationName: keyframesExit,
  animationDuration: '0.1s',
  animationTimingFunction: easeOutCubic,
};
export const accordionOpenAnimationStyles: StyleRule = {
  animationName: keyframesAccordionOpen,
  animationDuration: '0.2s',
  transitionTimingFunction: easeInOutCubic,
};
export const accordionCloseAnimationStyles: StyleRule = {
  animationName: keyframesAccordionClose,
  animationDuration: '0.2s',
  transitionTimingFunction: easeInOutCubic,
};
