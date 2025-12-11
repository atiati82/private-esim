import type { ReactElement } from 'react';
import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@/data-store/store';

export enum MessageType {
  Message = 'message',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export interface FlashMessage {
  /**
   * Flash message path.
   * Can be something like `account.path` and can be later on selected by exact match
   * or by providing path selector like `account.*` to show all messages from given path.
   */
  path: string;
  messageType: MessageType;
  title?: string;
  message: string | ReactElement;
}

export interface MessagesState {
  flashMessages: Record<string, FlashMessage>;
}
const initialState: MessagesState = {
  flashMessages: {},
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    /**
     * Emit new flash message (to be shown to the user)
     */
    emitFlashMessage(state, action: PayloadAction<FlashMessage>) {
      state.flashMessages[action.payload.path] = action.payload;
    },
    /**
     * Delete flash message by its path (after it has been presented to the user)
     */
    clearFlashMessage: (state, action: PayloadAction<string>) => {
      delete state.flashMessages[action.payload];
    },
  },
});

export const selectAllFlashMessages = createSelector(
  [(rootState: RootState) => rootState.messages],
  (messagesState: MessagesState) => messagesState.flashMessages,
);

/**
 * Get the most recent flash message by its path.
 *
 * Can be exact path like `account.verify` or entire `account.*` section, when
 * you're interested in any message from the `account` path.
 *
 * @usage
 * ```
 * // Select any last message
 * selectFlashMessage('*');
 *
 * // Select the exact message id and nothing else
 * selectFlashMessage('account.created');
 *
 * // Select any message from the `account.` domain
 * selectFlashMessage('account.*');
 * ```
 */
export const selectFlashMessage =
  (selectPath: string = '*') =>
  (rootState: RootState): FlashMessage | undefined => {
    const flashMessages = selectAllFlashMessages(rootState);
    const recentMessagePaths = Object.keys(flashMessages).reverse();

    const recentMessagePath: string | undefined = recentMessagePaths[0];
    if (!recentMessagePath) {
      return;
    }

    if (selectPath === '*' || selectPath === '') {
      return flashMessages[recentMessagePath];
    } else if (selectPath.endsWith('.*')) {
      const pathToStartWith = selectPath.slice(0, selectPath.indexOf('*') - 1);
      const foundPath = recentMessagePaths.find((p) => p.startsWith(pathToStartWith));
      return foundPath ? flashMessages[foundPath] : undefined;
    } else {
      return flashMessages[selectPath];
    }
  };

export const { emitFlashMessage, clearFlashMessage } = messagesSlice.actions;
