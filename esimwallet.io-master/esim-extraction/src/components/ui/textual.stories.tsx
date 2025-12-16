import type { Meta, StoryObj } from '@storybook/react';

import { Textual } from '@/components/ui/textual';

const textSample01 =
  `<strong>The <code>&lt;Textual /&gt;</code> element demo.</strong> In the year 2250, humanity had reached new heights in technological advancements. ` +
  `Colonizing other planets had become a norm, and intergalactic travel was commonplace. People could teleport ` +
  `from one planet to another in mere seconds, and flying cars filled the skies. Artificial intelligence ` +
  `was integrated into every aspect of life, from managing households to running complex interplanetary businesses. ` +
  `However, despite all the progress, there were still issues that needed to be addressed. Climate change had taken ` +
  `a toll on many planets, and resources were becoming scarce.`;

const meta: Meta<typeof Textual> = {
  title: 'Textual',
  component: Textual,
  argTypes: {},
  args: {
    children: textSample01,
    renderAsHtmlContent: true,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
