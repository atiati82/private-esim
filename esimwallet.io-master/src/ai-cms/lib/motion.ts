export const motionTiming = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  slower: 0.8,
  ambient: 4,
};

export const motionEasing = {
  smooth: [0.23, 0.82, 0.35, 1],
  snappy: [0.16, 1, 0.3, 1],
  bounce: [0.68, -0.55, 0.27, 1.55],
  easeOut: [0, 0, 0.2, 1],
};

export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: motionTiming.slow, ease: motionEasing.smooth },
};

export const fadeDown = {
  initial: { opacity: 0, y: -30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: motionTiming.slow, ease: motionEasing.smooth },
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: motionTiming.normal },
};

export const fadeLeft = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: motionTiming.slow, ease: motionEasing.smooth },
};

export const fadeRight = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: motionTiming.slow, ease: motionEasing.smooth },
};

export const scaleUp = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: motionTiming.slow, ease: motionEasing.smooth },
};

export const stagger = {
  container: {
    initial: {},
    whileInView: {
      transition: { staggerChildren: 0.08 },
    },
    viewport: { once: true, amount: 0.1 },
  },
  containerFast: {
    initial: {},
    whileInView: {
      transition: { staggerChildren: 0.05 },
    },
    viewport: { once: true, amount: 0.1 },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: motionTiming.normal, ease: motionEasing.smooth },
  },
};

export const hover = {
  lift: {
    whileHover: { y: -4 },
    transition: { duration: motionTiming.fast },
  },
  scale: {
    whileHover: { scale: 1.02 },
    transition: { duration: motionTiming.fast },
  },
  glow: {
    whileHover: { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
    transition: { duration: motionTiming.fast },
  },
};

export const ambient = {
  pulse: {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: motionTiming.ambient,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  float: {
    animate: {
      y: [0, -6, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  floatSlow: {
    animate: {
      y: [0, -4, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  shimmer: {
    animate: {
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  breathe: {
    animate: {
      scale: [1, 1.01, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

export const MOTION_ARCHETYPES = {
  'liquid-crystal-float': {
    name: 'Liquid-Crystal Float',
    description: 'Soft floating movement like water in zero-gravity',
    entrance: fadeUp,
    ambient: ambient.float,
    hover: hover.lift,
  },
  'energetic-pulse': {
    name: 'Energetic Pulse',
    description: 'Bioelectric rhythmic light pulsing',
    entrance: scaleUp,
    ambient: ambient.pulse,
    hover: hover.glow,
  },
  'magnetic-drift': {
    name: 'Magnetic Drift',
    description: 'Elements attract/repel from cursor',
    entrance: fadeLeft,
    ambient: ambient.floatSlow,
    hover: hover.scale,
  },
  'krystal-bloom': {
    name: 'Krystal Bloom',
    description: 'Soft glow expansion + scale',
    entrance: scaleUp,
    ambient: ambient.shimmer,
    hover: hover.glow,
  },
  'scalar-slide': {
    name: 'Scalar Slide',
    description: 'Linear but softly accelerated motion',
    entrance: fadeRight,
    ambient: ambient.breathe,
    hover: hover.lift,
  },
  'vortex-reveal': {
    name: 'Vortex Reveal',
    description: 'Staggered emergent spiral motion',
    entrance: fadeUp,
    stagger: stagger.container,
    hover: hover.scale,
  },
  'parallax-depth': {
    name: 'Parallax Depth',
    description: 'Multi-layer depth scroll effect',
    entrance: fadeIn,
    ambient: ambient.floatSlow,
    hover: hover.lift,
  },
  'ripple-emergence': {
    name: 'Ripple Emergence',
    description: 'Outward wave-like reveal',
    entrance: scaleUp,
    stagger: stagger.containerFast,
    hover: hover.scale,
  },
  'subtle-shimmer': {
    name: 'Subtle Shimmer',
    description: 'Gentle brightness oscillation',
    entrance: fadeIn,
    ambient: ambient.shimmer,
    hover: hover.glow,
  },
  'layered-parallax': {
    name: 'Layered Parallax Scroll',
    description: 'Background/foreground at different scroll speeds',
    entrance: fadeUp,
    ambient: ambient.float,
    hover: hover.lift,
  },
} as const;

export type MotionArchetype = keyof typeof MOTION_ARCHETYPES;

export function getMotionArchetype(name: MotionArchetype): (typeof MOTION_ARCHETYPES)[MotionArchetype] {
  return MOTION_ARCHETYPES[name];
}
