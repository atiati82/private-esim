import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButtonLink, ButtonLinkProps } from '@/navigation';

import * as styles from './pagination.css';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>): React.JSX.Element => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn(styles.paginationContainer, className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn(styles.paginationContent, className)} {...props} />
  ),
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn(styles.paginationItem, className)} {...props} />
  ),
);
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
  href: string;
  disabled?: boolean;
} & ButtonLinkProps;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  href,
  ...props
}: PaginationLinkProps): React.JSX.Element => (
  <ButtonLink
    href={href}
    variant={isActive ? 'primary' : 'ghost'}
    size={size}
    aria-current={isActive ? 'page' : undefined}
    className={cn(styles.paginationHref({ as: isActive ? 'active' : 'outline' }))}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>): React.JSX.Element => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn(styles.paginationHref({ as: 'outline' }), className, {
      disabled: disabled,
    })}
    {...props}
  >
    <span>« Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>): React.JSX.Element => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn(styles.paginationHref({ as: 'outline' }), className, {
      disabled: disabled,
    })}
    {...props}
  >
    <span>Next »</span>
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>): React.JSX.Element => (
  <span aria-hidden className={cn(className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
