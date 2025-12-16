import React from 'react';
import { ShieldAlertIcon, ShieldCheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui.shadcn/alert';
import { AlertVariantsVariant } from '@/components/ui.shadcn/alert.css';
import * as styles from './message.css';

export interface MessageProps extends React.PropsWithChildren {
  className?: string;
  /**
   * Message variant. If not specified, it'll be derived from passed other props
   * (e.g. `variant=error` if `error` property is set with the error content to show).
   * @default default
   */
  variant?: AlertVariantsVariant | null;
  showIcon?: boolean;
  title?: string | React.ReactNode | null;
  message?: string | React.ReactNode | null;
  success?: string | React.ReactNode | null;
  warning?: string | React.ReactNode | null;
  error?: string | React.ReactNode | null;
}

/**
 * Wrapper around `Alert` shadcn component to support easily passing message content.
 *
 * Used to show arbitrary message in the UI.
 *
 * Can be used together with `RenderFlashMessage` which renders messages
 * dispatched via Store actions (`emitFlashMessage()`).
 */
export const Message: React.FC<MessageProps> = ({
  className,
  variant,
  showIcon = true,
  title,
  children,
  message,
  success,
  warning,
  error,
}) => {
  const messageToRender = children || message || error || success || warning;

  const cmpVariant: MessageProps['variant'] =
    variant ||
    (message && 'default') ||
    (success && 'success') ||
    (warning && 'warning') ||
    (error && 'error') ||
    'default';

  let IconVariant: React.ReactElement;
  switch (cmpVariant) {
    case 'warning':
    case 'error':
      IconVariant = <ShieldAlertIcon />;
      break;
    default:
      IconVariant = <ShieldCheckIcon />;
  }

  if (title || messageToRender) {
    return (
      <Alert variant={cmpVariant} data-variant={cmpVariant} className={cn('message', styles.messageWrapper, className)}>
        {showIcon && IconVariant}
        {title && <AlertTitle className={cn('message-title')}>{title}</AlertTitle>}
        {messageToRender && (
          <AlertDescription className={cn('message-description', styles.description)}>
            {messageToRender}
          </AlertDescription>
        )}
      </Alert>
    );
  }

  return null;
};
