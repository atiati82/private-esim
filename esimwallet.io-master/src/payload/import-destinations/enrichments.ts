import type { RegionId } from '@/data/region';

/**
 * Extra countries to add to our database, not present in `country-json` package
 * @url country-json/src/country-by-abbreviation.json
 *
 * @see makeDestinations
 */
export const extraCountries = [
  { abbreviation: 'AX', country: 'Åland Islands' },
  { abbreviation: 'BL', country: 'Saint Barthélemy' },
  { abbreviation: 'BQ', country: 'Bonaire, Sint Eustatius and Saba' },
  { abbreviation: 'CW', country: 'Curaçao' },
  { abbreviation: 'MF', country: 'Saint Martin' },
  { abbreviation: 'SX', country: 'Sint Maarten' },
  { abbreviation: 'TW', country: 'Taiwan' },
  { abbreviation: 'XK', country: 'Kosovo' },
];

export const extraCountriesByRegion: Record<string, RegionId> = {
  'Åland Islands': 'europe',
  'Bonaire, Sint Eustatius and Saba': 'latin-america',
  'Curaçao': 'latin-america',
  'Guernsey': 'europe',
  'Isle of Man': 'europe',
  'Jersey': 'europe',
  'Kosovo': 'europe',
  'Montenegro': 'europe',
  'Saint Barthélemy': 'latin-america',
  'Saint Martin': 'latin-america',
  'Sint Maarten': 'latin-america',
  'Taiwan': 'asia',
  'Timor-Leste': 'asia',
};

/**
 * When making Destination, we map some country names
 */
export function jsonDbGetNormalisedCountryName(countryName: string): string {
  const theirNamesToOurNames: Record<string, string> = {
    'Holy See (Vatican City State)': 'Vatican',
    'Micronesia, Federated States of': 'Micronesia',
  };
  return theirNamesToOurNames[countryName] ?? countryName;
}

export const topDestinations = [
  'us',
  'es',
  'fr',
  'it',
  'gb',
  'de',
  'jp',
  'cn',
  'ru',
  'in',
  'au',
  'tr',
  'br',
  'mx',
  'za',
  'th',
];
