import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { LoaderIcon } from 'lucide-react';

import { cn, isTruthy } from '@/lib/utils';

import { ButtonVariants, buttonVariants, loadingIcon } from './button.css';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants & {
    asChild?: boolean;
    /**
     * Set to TRUE to show loading spinner
     */
    isLoading?: boolean;
  };

/**
 * **Button** (the usual HTML `<button>`)
 * and **ButtonLink** (HTML `<a href>` but styled like a button) elements.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        role="button"
        {...props}
      >
        {isTruthy(isLoading) && <LoaderIcon size={20} className={loadingIcon} />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
