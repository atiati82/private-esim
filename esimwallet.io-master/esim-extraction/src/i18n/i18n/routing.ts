/**
 * Available site locales (i.e. languages)
 */
export const siteLocales = ['en', 'es'] as const;

export type Locale = (typeof siteLocales)[number];
export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  // de: 'Deutsch', // German in German
  en: 'English',
  es: 'Español', // Spanish in Spanish
  // fr: 'Français', // French in French
  // pl: 'Polski', // Polish in Polish
  // ru: 'Русский', // Russian in Russian
};

/**
 * Config for INTL middleware
 */
export const intlRoutingConfig = {
  locales: siteLocales,
  defaultLocale: defaultLocale,
  localePrefix: 'as-needed' as const,
};
