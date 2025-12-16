'use client';

import React, { useEffect } from 'react';

import { clearFlashMessage, selectFlashMessage } from '@/data-store/messages';
import { useAppDispatch, useAppSelector } from '@/data-store/store-hooks';

import { Message } from '@/components/ui/message/message';

/**
 * After this time (ms), a flash message
 * is considered as displayed and will be cleared from the store
 */
export const FlashMessageClearTime = 60 * 1000;

export type RenderFlashMessageProps = {
  className?: string;
  messagePath?: string;
};

/**
 * Renders message(s) dispatched via Store actions ({@link emitFlashMessage}).
 */
export const RenderFlashMessage: React.FC<RenderFlashMessageProps> = ({ className, messagePath }) => {
  const dispatch = useAppDispatch();
  const flashMessage = useAppSelector(selectFlashMessage(messagePath || '*'));

  useEffect(() => {
    if (flashMessage) {
      // TODO: need to add [CLOSE] button to dismiss the message
      //  or add customisable timer when dispatching the message, so it disappears after certain time
      const timer = setTimeout(() => {
        dispatch(clearFlashMessage(flashMessage.path));
      }, FlashMessageClearTime);
      return () => clearTimeout(timer);
    }
    return;
  }, [flashMessage, dispatch, messagePath]);

  if (!flashMessage) {
    return null;
  }
  return (
    <Message
      data-message-type={flashMessage.messageType}
      className={className}
      title={flashMessage.title}
      {...{
        [flashMessage.messageType]: flashMessage.message,
      }}
    />
  );
};
