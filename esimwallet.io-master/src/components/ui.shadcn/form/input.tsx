import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'alt';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return <input type={type} className={cn(variant, className)} ref={ref} {...props} />;
  },
);
Input.displayName = 'Input';
