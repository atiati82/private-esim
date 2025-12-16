import { globalKeyframes } from '@vanilla-extract/css';

import {
  keyframesAccordionClose,
  keyframesAccordionOpen,
  keyframesEnter,
  keyframesExit,
  keyframesSpin,
} from '@/styles/animations/rules';

globalKeyframes(keyframesSpin, {
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

globalKeyframes(keyframesEnter, {
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});
globalKeyframes(keyframesExit, {
  to: { opacity: 0 },
});

globalKeyframes(keyframesAccordionOpen, {
  from: { height: '0' },
  to: { height: 'var(--radix-accordion-content-height)' },
});
globalKeyframes(keyframesAccordionClose, {
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: '0' },
});
