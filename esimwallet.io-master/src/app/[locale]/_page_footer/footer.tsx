import React from 'react';
import Link from 'next/link';

import { isDevelopment, isProduction } from '@/env-helpers';
import { cn } from '@/lib/utils';

import { debugScreens } from '@/styles/utils/debug-screens.css';
import { FooterAbout } from './footer-about';
import { footerLinks, footerSocialMediaLinks } from './footer-data';
import { FooterSection } from './footer-section';
import * as styles from './footer.css';

export const Footer: React.FC = () => {
  return (
    <div className={cn(styles.footerWrapper, (isDevelopment || isProduction) && debugScreens)}>
      <footer className={styles.footerContainer}>
        <FooterAbout />

        {/* explore Private eSIM */}
        <FooterSection
          title="Explore Private eSIM"
          items={footerLinks.exploreSIMwallet}
          className={styles.footerExploreESIMwallet}
        />

        {/* customer care */}
        <FooterSection
          title="Customer Care"
          items={footerLinks.customerCare}
          className={styles.footerCustomerCareSection}
        />

        {/* legal */}
        <FooterSection
          title="Legal"
          items={footerLinks.legal}
          className={styles.footerLegalSection}
        />

        {/* contact */}
        <FooterSection
          title="Contact"
          items={footerLinks.contact}
          className={styles.footerContactSection}
        />
      </footer>

      {/* copyright */}
      <div className={cn(styles.footerCopyrightsWrapper)}>
        <div className={styles.footerCopyrights}>
          <div>© 2024 Private eSIM. All rights reserved.</div>

          <div className={styles.footerCopyrightsSocialWrapper}>
            <p>Follow Us: </p>
            <div className={styles.footerCopyrightsSocialList}>
              {footerSocialMediaLinks.map((social) => {
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className={styles.footerIconSocialLink}
                  >
                    <social.src width={20} height={20} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
