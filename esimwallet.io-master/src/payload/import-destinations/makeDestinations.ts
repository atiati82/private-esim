import countryByCode from 'country-json/src/country-by-abbreviation.json';
import countryByCapitalCity from 'country-json/src/country-by-capital-city.json';
import countryByCurrency from 'country-json/src/country-by-currency-code.json';

import { isTestingEnv } from '@/env-helpers';
import { slug } from '@/lib/utils';
import { DestinationDto } from '@/payload/app-types';
import {
  extraCountries,
  jsonDbGetNormalisedCountryName,
  topDestinations,
} from '@/payload/import-destinations/enrichments';
import { getRegionForCountry } from '@/payload/import-destinations/makeRegions';

/**
 * Prepare complete list of destinations (aka countries),
 * ready to be imported into database of destinations.
 */
export function makeDestinations(): DestinationDto[] {
  const data: DestinationDto[] = [];
  const destinationIds: string[] = [];

  [...countryByCode, ...extraCountries].forEach((dbItem) => {
    const isoCode = getIsoCode(dbItem.abbreviation, dbItem.country);
    if (!isoCode) {
      if (isoCode === false) {
        !isTestingEnv &&
          console.warn(
            `Destination: ignoring [${dbItem.abbreviation}] ${dbItem.country} - not needed.`,
          );
      } else {
        !isTestingEnv &&
          console.warn(
            `Destination: skipping for [${dbItem.abbreviation}] ${dbItem.country} - iso code could not be generated`,
          );
      }

      return;
    }
    if (destinationIds.includes(isoCode)) {
      const existingDestination = data.find((d) => d.id === isoCode);
      console.error(
        `Destination ERROR: Trying to add [${isoCode}] ${dbItem.country} but this ISO code is already present (as [${existingDestination!.id}] ${existingDestination?.name})`,
      );
      return;
    } else {
      destinationIds.push(isoCode);
    }

    const countryName = jsonDbGetNormalisedCountryName(dbItem.country);
    const capitalCity = countryByCapitalCity.find((cbc) => cbc.country === dbItem.country);
    const currencyInfo = countryByCurrency.find((cbc) => cbc.country === dbItem.country);
    const region = getRegionForCountry(countryName);
    if (!region) {
      // console.warn('Destination: skipping for [' + isoCode + '] ' + countryName + ' - no region avail.');
      return;
    }

    const newDestination: Partial<DestinationDto> = {
      id: isoCode,
      slug: slug(countryName),
      region,
      name: countryName,
      published: true,
      isTopDestination: topDestinations.includes(isoCode),
      currency: currencyInfo ? String(currencyInfo.currency_code) : '',
      keywords: capitalCity ? String(capitalCity.city) : '',
    };
    data.push(enrichDestination(newDestination));
  });
  return data;
}

/**
 * Helper for destinations.find() - find by destination's ISO code
 */
export const findByCountryId = (code?: string) => (destination: DestinationDto) => {
  const id = code?.toLowerCase() ?? '';
  return code ? destination.id === id || destination.altIsoCodes?.includes(id) : false;
};

/**
 * Some codes in country-json lib are incorrect - map them to the right ISO code
 *
 * @return FALSE for unwanted/ignored destinations
 */
function getIsoCode(isoCode: string, countryName: string): string | false {
  const code = isoCode.toLocaleLowerCase();
  switch (countryName) {
    /** @see https://en.wikipedia.org/wiki/ISO_3166-2:GB **/
    case 'Northern Ireland':
      return 'gb-nir';
    case 'Netherlands Antilles': // code: AN - ignore, no longer exist
    case 'East Timor': // code: TP - ignore, we only want one Timor, Timor-Leste
      return false;
  }

  switch (code) {
    case 'uk':
      return 'gb';
  }

  return code;
}

function enrichDestination(destination: Partial<DestinationDto>): DestinationDto {
  switch (destination.id) {
    case 'ae':
      destination.keywords += `UAE, ${destination.keywords}`;
      break;
    case 'id':
      destination.keywords += ', Bali, Yogyakarta, Komodo. Lombok, Sumatra, Java';
      break;
    case 'cz':
      destination.keywords += ', Czechia, Prague';
      break;
    case 'gb':
      destination.keywords += ', Scotland, Wales, Ireland, Birmingham, Manchester, Glasgow, Leeds';
      break;
    case 'gb-nir': // Northern Ireland
      destination.parentDestination = 'gb';
      break;
    case 'kp': // North Korea, Democratic People's Republic of Korea
      destination.keywords = `DPRK, ${destination.keywords}`;
      break;
    case 'nl':
      destination.keywords = `Holland, Dutch, Netherlands Antilles, ${destination.keywords}, Rotterdam`;
      destination.altIsoCodes = ['an']; // Previously used code, for Netherlands Antilles
      break;
    case 'pl':
      destination.keywords += ', Warsaw, Krakow, Crakov, Gdansk, Gdynia, Sopot, Zakopane';
      break;
    case 'tl':
      destination.currency = 'USD';
      destination.keywords = 'Dili, East Timor';
      destination.altIsoCodes = ['tp']; // official code for East Timor?
      break;
    case 'tw':
      destination.currency = 'TWD';
      destination.keywords = 'Taipei City';
      break;
    case 'us':
      destination.keywords +=
        ', USA, Alaska, Arizona, California, Chicago, Colorado, Florida, Hawaii, Los Angeles, Nevada, NY New York, SF San Francisco, Texas, Virginia';
      break;
    case 'ht': // Haiti
      destination.altIsoCodes = ['us-hi'];
      break;
  }

  return destination as DestinationDto;
}
