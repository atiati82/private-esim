import * as React from 'react';

import { cn } from '@/lib/utils';

import { badgeVariants, BadgeVariants } from './badge.css';

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & BadgeVariants;

const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
};

export { Badge, badgeVariants };
