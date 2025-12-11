export { chat, chatWithFunctions, openai } from './services/ai-client';
export type { ChatMessage, AIModel } from './services/ai-client';

export { bigmindChat, executeCmsFunction, CLUSTER_ONTOLOGY, BIGMIND_SYSTEM_PROMPT } from './services/bigmind-cms';
export type { CMSStorage } from './services/bigmind-cms';

export { parseBigMindResponse, generateSlugFromTitle } from './lib/bigmind-parser';
export type { ParsedBigMindResponse } from './lib/bigmind-parser';

export {
  motionTiming,
  motionEasing,
  fadeUp,
  fadeDown,
  fadeIn,
  fadeLeft,
  fadeRight,
  scaleUp,
  stagger,
  hover,
  ambient,
  MOTION_ARCHETYPES,
  getMotionArchetype,
} from './lib/motion';
export type { MotionArchetype } from './lib/motion';
