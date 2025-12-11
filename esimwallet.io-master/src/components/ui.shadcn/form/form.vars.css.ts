import { createVar } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';

/**
 * In our design, <input> elements have rounded edges.
 * For this, a bit of paddingX on label/descriptions
 * seems to look better.
 */
export const formLabelPaddingVar = createVar();
export const formLabelPaddingValue = cssVal.space.s3;
