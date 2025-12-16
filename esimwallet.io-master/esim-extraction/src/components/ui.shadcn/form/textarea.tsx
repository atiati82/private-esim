import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'primary', size = 'medium', ...props }, ref) => {
    // Construct the className based on variant and size
    const classNames = cn('textarea', variant, size, className);

    return <textarea className={classNames} ref={ref} {...props} />;
  },
);

Textarea.displayName = 'Textarea';
