import React from 'react';

import { cn } from '@/lib/utils';
import { Link } from '@/navigation';

import { IconProps } from '@/components/icons/IconProps';
import * as styles from './esimwallet-logo.css';

export interface EsimWalletLogoLinkProps {
  href?: string;
  linkClassName?: string;
  logoClassName?: string;
}
export const EsimWalletLogoLink: React.FC<EsimWalletLogoLinkProps> = ({
  href = '/',
  linkClassName,
  logoClassName,
}) => {
  return (
    <Link
      href={href}
      className={cn(styles.logoLink, linkClassName)}
      title="Private eSIM - store home page"
    >
      <EsimWalletLogo className={logoClassName} />
    </Link>
  );
};

export interface EsimWalletLogoProps {
  className?: string;
}
export const EsimWalletLogo: React.FC<EsimWalletLogoProps> = ({ className }) => {
  return (
    <span className={cn(styles.logoWrapper, className)}>
      <EsimWalletIcon className={styles.logoIcon} />
      <span className={styles.logoText}>Private eSIM</span>
    </span>
  );
};

export const EsimWalletIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {/**
          <path d="M28.4525 0H9.73376C4.35795 0 0 4.57053 0 10.2086V29.8404C0 35.4785 4.35795 40.049 9.73376 40.049H28.4525C33.8283 40.049 38.1863 35.4785 38.1863 29.8404V10.2086C38.1863 4.57053 33.8283 0 28.4525 0Z" />
          /* Background mask under logo, ala button */}
        <mask id="mask0_wallet" maskUnits="userSpaceOnUse" x="5" y="8" width="27" height="24">
          <path d="M31.991 8.63806H5.24219V31.411H31.991V8.63806Z" fill="white" />
        </mask>
        <g mask="url(#mask0_wallet)">
          <path
            d="M10.9023 9.52561L13.8793 8.79004V11.9658L10.9023 12.7013V9.52561Z"
            fill="currentColor"
          />
          <path
            d="M5.24219 14.0999L9.26717 13.1056V17.3994L5.24219 18.3941V14.0999Z"
            fill="currentColor"
          />
          <path
            d="M23.9831 18.7045C24.2943 18.3318 24.3218 17.8161 24.0447 17.5527C23.7675 17.2892 23.2905 17.3777 22.9793 17.7503C22.6681 18.123 22.6405 18.6387 22.9177 18.9022C23.1949 19.1657 23.6718 19.0771 23.9831 18.7045Z"
            fill="currentColor"
          />
          <path
            d="M12.4384 31.411C11.864 31.411 10.5474 31.2566 10.3359 30.725L27.9696 26.3517C28.9175 26.1178 29.5799 25.2292 29.5799 24.1908V13.866H31.4512C31.7493 13.866 31.9909 14.1237 31.9909 14.4417V28.1786C31.9909 29.9638 30.6346 31.4107 28.9615 31.4107L12.4384 31.411Z"
            fill="currentColor"
          />
          <path
            d="M28.8674 10.0968V14.1442L23.4588 15.4806C22.7698 15.6511 22.1463 16.1029 21.6947 16.6959C21.2434 17.2889 20.964 18.0234 20.964 18.7585C20.964 20.2286 22.0807 21.1439 23.4585 20.8036L28.8671 19.467V24.1904C28.8671 24.8689 28.4283 25.4576 27.8086 25.6106L10.3359 29.928V16.6209L13.8782 15.7456V17.6245L15.6393 17.1893V15.3103L13.8782 15.7456V11.9657L27.1922 8.67624C28.0488 8.46477 28.8674 9.15848 28.8674 10.0968Z"
            fill="currentColor"
          />
          <path
            d="M10.7129 16.9402L13.5021 16.2512V18.1302L16.0163 17.5087V14.8051L14.2552 15.2403V12.2854L27.2776 9.06784C27.3523 9.04946 27.4284 9.04004 27.5039 9.04004C28.0482 9.04004 28.491 9.51435 28.491 10.0972V13.8251L23.374 15.0894C22.6261 15.2746 21.9262 15.755 21.4025 16.4429C20.8772 17.1333 20.5876 17.9559 20.5876 18.7589C20.5876 18.9852 20.6105 19.2039 20.6566 19.4129C17.6495 20.3733 14.2267 20.8927 10.7129 20.9212V16.9402Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  );
};
