import React from 'react';

import { HomePageBitsAndPieces } from '@/app/[locale]/(home-page-components)/HomePageBitsAndPieces';
import { MainHero } from '@/app/[locale]/(home-page-components)/main-hero';

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <MainHero />
      <HomePageBitsAndPieces />
    </>
  );
}

