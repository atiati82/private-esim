'use client';

import React, { useTransition } from 'react';

import { Locale, localeLabels, siteLocales } from '@/i18n/routing';
import { usePathname, useRouter } from '@/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui.shadcn/form/select';

type LanguageSwitcherProps = { currentLocale: Locale };

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLocale }) => {
  const router = useRouter();
  const path = usePathname();
  const [isPending, startTransition] = useTransition();

  function onSelectChange(newLocale: Locale): void {
    startTransition(() => {
      router.push(path, { locale: newLocale });
    });
  }

  return (
    <Select defaultValue={currentLocale} onValueChange={onSelectChange} disabled={isPending}>
      <SelectTrigger data-testid="language-switcher" className="w-[200px]">
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        {siteLocales.map((locale: Locale) => (
          <SelectItem key={locale} value={locale}>
            {localeLabels[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
