import * as React from 'react';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { type VariantProps } from 'class-variance-authority';

import { siteLocales } from '@/i18n/routing';
import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui.shadcn/form/button';

export { useParams, useSearchParams } from 'next/navigation'; // re-export, just for convenience

// Use these instead of original Link, useRouter() functions
// to get out-of-the box, correct links and router with current locale info.
export const { Link, redirect, permanentRedirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({
    locales: siteLocales,
    localePrefix: 'as-needed',
  });

type LinkProps = Parameters<typeof Link>[0];
export interface ButtonLinkProps extends LinkProps, VariantProps<typeof buttonVariants> {}

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  href,
  className,
  variant,
  size,
  ...props
}) => {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      role="link"
      {...props}
    />
  );
};
ButtonLink.displayName = 'ButtonLink';
