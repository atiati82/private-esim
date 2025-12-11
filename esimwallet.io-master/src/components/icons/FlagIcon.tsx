import React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

import { IconProps } from '@/components/icons/IconProps';
import { Avatar, AvatarFallback } from '@/components/ui.shadcn/avatar';

const FLAGS_SVG_PATH = '/flags/1x1';

interface FlagIconProps extends IconProps {
  /**
   * ISO code (2-char) of the country (can be a lower- or upper-cased)
   */
  code: string;
}

/**
 * Show svg icon of the country.
 */
export const FlagIcon: React.FC<FlagIconProps> = ({ className, code }) => {
  const flagCode = code.toUpperCase();
  return (
    <Avatar className={cn(className)}>
      {/* Don't use <AvatarImage> as it doesn't support lazy loading. */}
      {/* Important when rendering list of searched destinations */}
      {/* It might return long list of destinations and fetching all flags is causing delays in UI */}
      {/* Unfortunately, that breaks the fallback functionality so... effectively this component needs to be re-done. */}
      <Image
        src={`${FLAGS_SVG_PATH}/${flagCode}.svg`}
        className="aspect-square h-full w-full"
        alt={flagCode}
        unoptimized
        fill={true}
      />
      <AvatarFallback>{flagCode}</AvatarFallback>
    </Avatar>
  );
};
