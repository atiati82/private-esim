import React from 'react';

import { CompatibleDevices } from '@/app/[locale]/(home-page-components)/compatible-devices';
import { HowItWorks } from '@/app/[locale]/(home-page-components)/how-it-works';
import { WhyEsimwallet } from '@/app/[locale]/(home-page-components)/whyesimwallet';

export const HomePageBitsAndPieces: React.FC = () => {
  return (
    <div>
      <WhyEsimwallet />
      <HowItWorks />
      <CompatibleDevices />
    </div>
  );
};
