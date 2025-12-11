import React from 'react';

import { Link } from '@/navigation';

import { footerSocialMediaLinks } from './footer-data';
import * as styles from './footer.css';

const compactLinks = [
  { name: 'Store', url: '/#store' },
  { name: 'Blog', url: '/blog' },
  { name: 'FAQs', url: '/faq' },
  { name: 'Contact', url: '/contact' },
  { name: 'Privacy', url: '/privacy-policy' },
  { name: 'Terms', url: '/tcs' },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLinksRow}>
          {compactLinks.map((link, index) => (
            <React.Fragment key={link.name}>
              <Link href={link.url} className={styles.footerLink}>
                {link.name}
              </Link>
              {index < compactLinks.length - 1 && (
                <span className={styles.footerDivider}>·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.footerRight}>
          <div className={styles.footerSocialList}>
            {footerSocialMediaLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className={styles.footerIconSocialLink}
                aria-label={social.name}
              >
                <social.src width={16} height={16} />
              </Link>
            ))}
          </div>
          
          <span className={styles.footerCopyright}>
            © {currentYear} Private eSIM
          </span>
        </div>
      </div>
    </footer>
  );
};
