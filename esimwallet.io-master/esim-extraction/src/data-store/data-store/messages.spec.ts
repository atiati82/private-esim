import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

import {
  clearFlashMessage,
  emitFlashMessage,
  FlashMessage,
  messagesSlice,
  MessageType,
  selectAllFlashMessages,
  selectFlashMessage,
} from '@/data-store/messages';
import { RootState } from '@/data-store/store';

describe('Store: Messages', () => {
  let store: EnhancedStore<RootState>;
  let rootState: RootState;

  beforeEach(() => {
    store = configureStore({
      reducer: { messages: messagesSlice.reducer },
    }) as EnhancedStore<RootState>;
    store.subscribe(() => (rootState = store.getState()));
    rootState = store.getState();
  });

  const mockAccountVerifyMessage: FlashMessage = {
    path: 'account.verify',
    messageType: MessageType.Message,
    message: 'Verify your account',
  };
  const mockAccountCreatedMessage: FlashMessage = {
    path: 'account.created',
    messageType: MessageType.Message,
    message: 'Account created',
  };
  const mockAccountLockedMessage: FlashMessage = {
    path: 'account.locked',
    messageType: MessageType.Message,
    message: 'Account locked',
  };
  const mockLastMessage: FlashMessage = {
    path: 'last.message',
    messageType: MessageType.Message,
    message: 'Last Message',
  };

  test('initial state', () => {
    expect(selectAllFlashMessages(rootState)).toEqual({});
  });

  test('emit new flash message', () => {
    store.dispatch(emitFlashMessage(mockAccountLockedMessage));
    expect(selectAllFlashMessages(rootState)).toEqual({
      [mockAccountLockedMessage.path]: mockAccountLockedMessage,
    });
  });

  test('emit another flash message', () => {
    store.dispatch(emitFlashMessage(mockAccountLockedMessage));
    store.dispatch(emitFlashMessage(mockAccountVerifyMessage));
    expect(selectAllFlashMessages(rootState)).toEqual({
      [mockAccountLockedMessage.path]: mockAccountLockedMessage,
      [mockAccountVerifyMessage.path]: mockAccountVerifyMessage,
    });
  });

  test('emit then clear message', () => {
    store.dispatch(emitFlashMessage(mockAccountLockedMessage));
    store.dispatch(emitFlashMessage(mockAccountVerifyMessage));

    store.dispatch(clearFlashMessage('non.existing.path'));
    expect(selectAllFlashMessages(rootState)).toEqual({
      [mockAccountLockedMessage.path]: mockAccountLockedMessage,
      [mockAccountVerifyMessage.path]: mockAccountVerifyMessage,
    });

    // clear 1 message
    store.dispatch(clearFlashMessage(mockAccountVerifyMessage.path));
    expect(selectAllFlashMessages(rootState)).toEqual({
      [mockAccountLockedMessage.path]: mockAccountLockedMessage,
    });

    // clear 2nd message
    store.dispatch(clearFlashMessage(mockAccountLockedMessage.path));
    expect(selectAllFlashMessages(rootState)).toEqual({});
  });

  describe('selector: selectFlashMessage() by path', () => {
    beforeAll(() => {
      store.dispatch(emitFlashMessage(mockAccountVerifyMessage));
      store.dispatch(emitFlashMessage(mockAccountCreatedMessage));
      store.dispatch(emitFlashMessage(mockAccountLockedMessage));
      store.dispatch(emitFlashMessage(mockLastMessage));
    });

    test('select by wildcard *', () => {
      store.dispatch(emitFlashMessage(mockAccountLockedMessage));
      store.dispatch(emitFlashMessage(mockLastMessage));
      const selector = selectFlashMessage('*');
      const res = selector(rootState);
      expect(res).toBe(mockLastMessage);
    });

    test('select by wildcard * when no messages', () => {
      const selector = selectFlashMessage('*');
      const res = selector(rootState);
      expect(res).toBe(undefined);
    });

    test('select by exact path - when message not present', () => {
      store.dispatch(emitFlashMessage(mockLastMessage));
      const selector = selectFlashMessage('some.path');
      const res = selector(rootState);
      expect(res).toBe(undefined);
    });

    test('select by exact path', () => {
      store.dispatch(emitFlashMessage(mockAccountVerifyMessage));
      store.dispatch(emitFlashMessage(mockAccountCreatedMessage));
      store.dispatch(emitFlashMessage(mockAccountLockedMessage));
      store.dispatch(emitFlashMessage(mockLastMessage));
      const selector = selectFlashMessage(mockAccountCreatedMessage.path);
      const res = selector(rootState);
      expect(res).toBe(mockAccountCreatedMessage);
    });

    test('select by wildcard path.* - when message not present', () => {
      store.dispatch(emitFlashMessage(mockAccountLockedMessage));
      store.dispatch(emitFlashMessage(mockLastMessage));
      const selector = selectFlashMessage('some.path.*');
      const res = selector(rootState);
      expect(res).toBe(undefined);
    });

    test('select by wildcard account.*', () => {
      store.dispatch(emitFlashMessage(mockAccountCreatedMessage));
      store.dispatch(emitFlashMessage(mockAccountLockedMessage));
      store.dispatch(emitFlashMessage(mockLastMessage));
      const selector = selectFlashMessage('account.*');
      const res = selector(rootState);
      expect(res).toBe(mockAccountLockedMessage); // this is the last message from 'account.*' domain
    });

    test('select by wildcard account.created.*', () => {
      store.dispatch(emitFlashMessage(mockAccountVerifyMessage));
      store.dispatch(emitFlashMessage(mockAccountCreatedMessage));
      store.dispatch(emitFlashMessage(mockAccountLockedMessage));
      store.dispatch(emitFlashMessage(mockLastMessage));
      const selector = selectFlashMessage('account.created.*');
      const res = selector(rootState);
      expect(res).toBe(mockAccountCreatedMessage);
    });

    test('select by wildcard other.*', () => {
      store.dispatch(emitFlashMessage(mockLastMessage));
      store.dispatch(emitFlashMessage(mockAccountLockedMessage));
      const selector = selectFlashMessage('last.*');
      const res = selector(rootState);
      expect(res).toBe(mockLastMessage);
    });
  });
});
