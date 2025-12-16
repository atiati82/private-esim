import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { cn } from '@/lib/utils';
import { Link } from '@/navigation';

import { TableProseDemo } from '@/components/ui.shadcn/table-demo';
import { Textual } from '@/components/ui/textual';
import { pageContainer } from '@/styles/layout.css';
import { prose } from '@/styles/typography.css';

const meta: Meta<typeof Textual> = {
  title: 'Typography: Prose',
  component: Textual,
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className={cn(prose, pageContainer)} style={{ margin: '1rem 0' }}>
        <p>
          In the year 2250, humanity had reached new heights in technological advancements.
          Colonizing other planets had become a norm, and <Link href="/">intergalactic travel</Link>{' '}
          was commonplace. People could teleport from one planet to another in mere seconds, and
          flying cars filled the skies.
        </p>
        <p>
          <Link href="/">Artificial intelligence</Link> was integrated into every aspect of life,
          from managing households to running complex interplanetary businesses. However, despite
          all the progress, there were still issues that needed to be addressed. Climate change had
          taken a toll on many planets, and resources were becoming scarce.
        </p>
        <p>
          <strong>Now that we know who you are, I know who I am.</strong> I'm not a mistake! It all
          makes sense! In a comic, you know how you can tell who the arch-villain's going to be?
          He's the exact opposite of the hero. And most times they're friends, like you and me! I
          should've known way back when... You know why, David? Because of the kids. They called me
          Mr Glass.
        </p>
        <Textual>
          Here we using the <code>&lt;Textual /&gt;</code> element. You think water moves fast? You
          should see ice. It moves like it has a mind. Like it knows it killed the world once and
          got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't
          know exactly when we turned on each other, but I know that seven of us survived the
          slide... and only five made it out. Now we took an oath, that I'm breaking now. We said
          we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it
          doesn't hold a candle to man.
        </Textual>

        <pre>
          My money's in that office, right?
          <br />
          If she start giving me some bullshit about it ain't there,
          <br />
          and we got to go someplace else and get it,
          <br />
          <strong>I'm gonna shoot you in the head</strong> then and there.
        </pre>
        <p>
          Then I'm gonna shoot that bitch in the kneecaps, find out where my goddamn money is. She
          gonna tell me too. Hey, look at me when I'm talking to you, motherfucker. You listen: we
          go in there, and that nigga Winston or anybody else is in there, you the first
          motherfucker to get shot. You understand?
        </p>

        <TableProseDemo />

        <p>
          Your bones don't break, mine do. That's clear.{' '}
          <code>Your cells react to bacteria and viruses differently</code> than mine. You don't get
          sick, I do. That's also clear. But for some reason, you and I react the exact same way to
          water. We swallow it too fast, we choke. We get some in our lungs, we drown. However
          unreal it may seem, we are connected, you and I. We're on the same curve, just on opposite
          ends.
        </p>

        <ul>
          <li>Customize the look and feel of Elements to match the design of your site.</li>
          <li>
            Get up and running right away by picking the prebuilt theme that most closely resembles
            your website.
          </li>
          <li>
            Vivamus et leo faucibus, ultrices nulla volutpat, hendrerit neque. Quisque quis euismod
            arcu. Integer pulvinar dui quis diam tristique facilisis.{' '}
            <strong>Curabitur consectetur</strong>
            consectetur ligula, id laoreet ipsum rhoncus id. Donec non ultrices nibh. Donec interdum
            justo et neque egestas, id mattis sem bibendum.
          </li>
          <li>
            For <Link href="/">complete control</Link>, specify custom CSS properties for individual
            components appearing in the Element.
          </li>
        </ul>

        <Textual>
          <code>Textual:</code> Normally, both your asses would be dead as fucking fried chicken,
          but you happen to pull this shit while I'm in a transitional period so I don't wanna kill
          you, I wanna help you. But I can't give you this case, it don't belong to me. Besides,
          I've already been through too much shit this morning over this case to hand it over to
          your dumb ass.
        </Textual>
      </div>
    );
  },
};
