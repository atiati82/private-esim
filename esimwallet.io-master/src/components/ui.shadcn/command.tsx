'use client';

import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Dialog, DialogContent } from '@/components/ui.shadcn/dialog';
import * as styles from './command.css';

type CommandProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive> & {
  /**
   * Often you'll use `Command` inside `Popover`. In such case, border from there should be used.
   * But if you render `Command` component standalone, you'll perhaps want to use `borderContainer`
   * which will set the border + bg color.
   */
  variant?: 'borderContainer';
};

/**
 * Command, render lists of CommandItems (with keyboard nav support
 *
 * HINT: use `variant=borderContainer` if you use it outside of Popover (which comes with its own border)
 */
const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, CommandProps>(
  ({ className, variant, ...props }, ref) => (
    <CommandPrimitive
      ref={ref}
      className={cn(
        'command',
        styles.commandContainer,
        variant === 'borderContainer' && styles.commandContainer_borderContainer,
        className,
      )}
      {...props}
    />
  ),
);
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog: React.FC = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  /* eslint-disable-next-line react/no-unknown-property */
  <div className={cn('command-input', styles.commandInputContainer)} cmdk-input-wrapper="">
    <Search className={styles.commandInputIcon} strokeWidth={1} />
    <CommandPrimitive.Input ref={ref} className={cn(styles.commandInputEl, className)} {...props} />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('command-list', styles.commandList, className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn('command-empty', styles.commandEmptyMsg, className)}
    {...props}
  />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn('command-group', styles.commandGroup, className)}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('command-separator', styles.commandSeparator, className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    linkInside?: boolean;
    variant?: 'navItem';
  }
>(({ className, linkInside, variant, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'command-item',
      styles.commandItem,
      linkInside && 'linkInside',
      variant,
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>>> = ({
  className,
  ...props
}) => {
  return <span className={cn(styles.commandKbdShortcut, className)} {...props} />;
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
