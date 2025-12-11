import { style } from '@vanilla-extract/css';

import { aboutSectionWrap, subTitle } from '@/app/[locale]/about/about.css';
import { cssVal } from '@/styles/css-values';
import { pageContainer } from '@/styles/layout.css';

export const ourJourneyContainer = style([pageContainer, aboutSectionWrap]);

export const ourJourneySubtitle = style([subTitle]);

export const ourJourneyParagraph = style({
  fontSize: cssVal.fontSize.md,
  lineHeight: cssVal.lineHeight.dynamic,
});
