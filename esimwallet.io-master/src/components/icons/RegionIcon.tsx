import React from 'react';

import { RegionId } from '@/data/region';
import { cn } from '@/lib/utils';

import { IconProps } from '@/components/icons/IconProps';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui.shadcn/avatar';

const SVG_PATH = '/flags/';

interface RegionIconProps extends IconProps {
  /**
   * First 2 chars from RegionId region code
   */
  code: RegionId | string;
}

export const RegionIcon: React.FC<RegionIconProps> = ({ className, code }) => {
  const regionCode = code.toUpperCase().substring(0, 2);

  const regionIcons: Record<string, string> = {
    EU: SVG_PATH + 'region-europe.svg',
    AS: SVG_PATH + 'region-asia.svg',
    AF: SVG_PATH + 'region-africa.svg',
    AM: SVG_PATH + 'region-america.svg',
    LA: SVG_PATH + 'region-latin-america.svg',
    AU: SVG_PATH + 'region-australia-oceania.svg',
  };
  const regionIcon = regionIcons[regionCode];

  return (
    <Avatar className={cn(className)}>
      {regionIcon && <AvatarImage src={regionIcon} />}
      <AvatarFallback>{regionCode}</AvatarFallback>
    </Avatar>
  );
};
