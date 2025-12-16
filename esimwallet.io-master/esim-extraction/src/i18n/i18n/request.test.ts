import { describe, expect, test } from 'vitest';

import { loadMessagesWithFallback } from './request';
import { defaultLocale } from './routing';

describe('app/i18', () => {
  test('It should load default messages, for default locale', async () => {
    const dict = await loadMessagesWithFallback(defaultLocale);
    expect(dict.Index.welcome).toContain('Seamlessly Connect to Global Networks');
    // This key is only present here, in default dictionary (EN)
    expect(dict.Index.welcomeForTest).toBe('test');
  });

  test('It should merge with default locale message', async () => {
    const dict = await loadMessagesWithFallback('es');
    expect(dict.Index.welcome).toContain('Compare y compre e-SIMs');
    // There's no such key in ES dictionary
    expect(dict.Index.welcomeForTest).toBe('test');
  });
});
