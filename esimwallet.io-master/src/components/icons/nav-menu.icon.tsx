import React from 'react';

import { cn } from '@/lib/utils';

import { IconProps } from '@/components/icons/IconProps';

export const NavMenuIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      className={cn('nav-menu-icon', className)}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.24004 2.60059H5.34002C3.15001 2.60059 2 3.75059 2 5.93059V7.83059C2 10.0106 3.15001 11.1606 5.33002 11.1606H7.23004C9.41005 11.1606 10.5601 10.0106 10.5601 7.83059V5.93059C10.5701 3.75059 9.42005 2.60059 7.24004 2.60059Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.6695 2.60059H16.7695C14.5895 2.60059 13.4395 3.75059 13.4395 5.93059V7.83059C13.4395 10.0106 14.5895 11.1606 16.7695 11.1606H18.6695C20.8495 11.1606 21.9995 10.0106 21.9995 7.83059V5.93059C21.9995 3.75059 20.8495 2.60059 18.6695 2.60059Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.6695 14.0303H16.7695C14.5895 14.0303 13.4395 15.1803 13.4395 17.3603V19.2603C13.4395 21.4403 14.5895 22.5903 16.7695 22.5903H18.6695C20.8495 22.5903 21.9995 21.4403 21.9995 19.2603V17.3603C21.9995 15.1803 20.8495 14.0303 18.6695 14.0303Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.24004 14.0303H5.34002C3.15001 14.0303 2 15.1803 2 17.3603V19.2603C2 21.4503 3.15001 22.6003 5.33002 22.6003H7.23004C9.41005 22.6003 10.5601 21.4503 10.5601 19.2703V17.3703C10.5701 15.1803 9.42005 14.0303 7.24004 14.0303Z"
      />
    </svg>
  );
};
