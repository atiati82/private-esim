import React from 'react';

import { WhyEsimwalletData } from '@/app/[locale]/(home-page-components)/whyesimwallet-data';
import { WhyEsimwalletList } from '@/app/[locale]/(home-page-components)/whyesimwallet-list';
import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';
import * as styles from './whyesimwallet.css';

export const WhyEsimwallet: React.FC = () => {
  return (
    <div className={styles.whyEsimWalletWrapper}>
      <Headline like="h1">Why Choose eSIMwallet</Headline>
      <Textual variant="muted" className={styles.whyEsimWalletSubtitle}>
        eSIMwallet is your go-to solution for effortless global connectivity and you can switch and
        manage mobile networks easily wherever you are.
      </Textual>
      <WhyEsimwalletList items={WhyEsimwalletData} />
    </div>
  );
};
