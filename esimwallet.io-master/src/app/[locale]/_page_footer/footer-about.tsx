import React from 'react';

import { EsimWalletLogoLink } from '@/components/icons/esimwallet-logo';
import * as styles from './footer-about.css';
import { footerPaymentLogos } from './footer-data';

export const FooterAbout: React.FC = () => {
  return (
    <div className={styles.footerLogoSection}>
      <EsimWalletLogoLink linkClassName={styles.footerLogoLink} logoClassName={styles.footerLogo} />

      <p className={styles.footerCompanyDescription}>
        Discover the future of mobile connectivity with Private eSIM – flexible, prepaid eSIM
        solutions designed for travelers, digital nomads and business professionals. Unlock the
        world with Private eSIM, simplified with eSIM technology.
      </p>

      <div className={styles.footerLogoPaymentsIcons}>
        {footerPaymentLogos.map((logo) => {
          return (
            <div key={logo.name}>
              <logo.src className={styles.footerPaymentsLogo} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
