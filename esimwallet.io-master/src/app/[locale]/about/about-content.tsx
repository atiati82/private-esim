import React from 'react';

import { AboutHero } from '@/app/[locale]/about/about-hero';
import { aboutContainer } from '@/app/[locale]/about/about.css';
import { GetInTouch } from '@/app/[locale]/about/get-in-touch';
import { OurJourney } from '@/app/[locale]/about/our-journey';
import { CuttingEdgeTechnology } from './cutting-edge-technology';
import { MeetOurTeam } from './meet-our-team';
import { OurCoreValues } from './our-core-values';

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type Member = {
  name: string;
  role: string;
  description: string;
  image: string;
};

type CoreValues = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type AboutPageProps = {
  features: Feature[];
  members: Member[];
  values: CoreValues[];
};

const AboutPageContent: React.FC<AboutPageProps> = ({ features, members, values }) => {
  return (
    <div className={aboutContainer}>
      <AboutHero />
      <OurJourney />
      <OurCoreValues values={values} />
      <MeetOurTeam members={members} />
      <CuttingEdgeTechnology features={features} />
      <GetInTouch />
    </div>
  );
};

export default AboutPageContent;
