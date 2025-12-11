import * as React from 'react';

import { cn } from '@/lib/utils';

import { ButtonGroupVariants } from './button-group.css';
import * as styles from './button-group.css';

export type ButtonGroupProps = ButtonGroupVariants & {
  children?: Iterable<React.ReactNode>;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * **ButtonGroup** render list of Button or LinkButton elements
 * in the form of toolbar / tabs.
 *
 * Add `active` class to the button element you want to mark as active/selected.
 */
const ButtonGroup: React.FC<ButtonGroupProps> = ({ className, variant, children, ...props }) => {
  // Split all provider button elements into array... so each item can be rendered individually
  const buttons = Array.from(children ?? []);
  return (
    <div className={cn(styles.buttonGroupVariants({ variant }), className)} role="group" {...props}>
      {buttons.map((button, key) => (
        <ButtonGroupItem key={key}>{button}</ButtonGroupItem>
      ))}
    </div>
  );
};
ButtonGroup.displayName = 'ButtonGroup';

const ButtonGroupItem: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className={cn('button-group-item', styles.buttonGroupItem)}>{children}</div>;
};

export { ButtonGroup };
