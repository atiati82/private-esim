import React from 'react';
import Link from 'next/link';

import { isDevelopment, isProduction } from '@/env-helpers';
import { cn } from '@/lib/utils';

import { EsimWalletLogoLink } from '@/components/icons/esimwallet-logo';
import { debugScreens } from '@/styles/utils/debug-screens.css';
import { footerLinks, footerSocialMediaLinks } from './footer-data';
import * as styles from './footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className={cn(styles.footerWrapper, (isDevelopment || isProduction) && debugScreens)}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <EsimWalletLogoLink linkClassName={styles.logoLink} logoClassName={styles.logo} />
          
          <nav className={styles.footerNav}>
            <div className={styles.linkGroup}>
              {footerLinks.exploreSIMwallet.slice(0, 4).map((link) => (
                <Link key={link.name} href={link.url} className={styles.footerLink}>
                  {link.name}
                </Link>
              ))}
            </div>
            <div className={styles.linkGroup}>
              {footerLinks.customerCare.map((link) => (
                <Link key={link.name} href={link.url} className={styles.footerLink}>
                  {link.name}
                </Link>
              ))}
              {footerLinks.legal.slice(0, 2).map((link) => (
                <Link key={link.name} href={link.url} className={styles.footerLink}>
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className={styles.socialLinks}>
            {footerSocialMediaLinks.map((social) => (
              <Link key={social.name} href={social.href} className={styles.socialLink}>
                <social.src width={18} height={18} />
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span className={styles.copyright}>© 2024 Private eSIM. All rights reserved.</span>
          <div className={styles.bottomLinks}>
            <Link href={footerLinks.contact[1].url} className={styles.bottomLink}>Contact</Link>
            <span className={styles.divider}>·</span>
            <Link href={footerLinks.legal[0].url} className={styles.bottomLink}>Terms</Link>
            <span className={styles.divider}>·</span>
            <Link href={footerLinks.legal[1].url} className={styles.bottomLink}>Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
