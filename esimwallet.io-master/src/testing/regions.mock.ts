import { makeRegionObj } from '@/data/region';
import { RegionDto } from '@/payload/app-types';

export const mockRegionDtoAmerica: RegionDto = {
  id: 'america',
  name: 'America',
  slug: 'america',
  published: true,
  createdAt: '2024-04-25T10:40:42.473Z',
  updatedAt: '2024-04-25T10:40:42.473Z',
};
export const mockRegionDtoAuO: RegionDto = {
  id: 'australia-oceania',
  name: 'Australia and Oceania',
  slug: 'australia-oceania',
  published: true,
  createdAt: '2024-04-25T10:40:42.473Z',
  updatedAt: '2024-04-25T10:40:42.473Z',
};
export const mockRegionDtoAfrica: RegionDto = {
  id: 'africa',
  name: 'Africa',
  slug: 'africa',
  published: true,
  createdAt: '2024-04-25T10:40:42.473Z',
  updatedAt: '2024-04-25T10:40:42.473Z',
};
export const mockRegionDtoMiddleEast: RegionDto = {
  id: 'middle-east',
  name: 'Middle East',
  slug: 'middle-east',
  published: true,
  createdAt: '2024-04-25T10:40:42.473Z',
  updatedAt: '2024-04-25T10:40:42.473Z',
};
export const mockRegionDtoAsia = {
  id: 'asia',
  name: 'Asia',
  slug: 'asia',
  published: true,
  createdAt: '2024-04-25T10:40:42.473Z',
  updatedAt: '2024-04-25T10:40:42.473Z',
};
export const mockRegionDtoLatAm: RegionDto = {
  id: 'latin-america',
  name: 'Latin America',
  slug: 'latin-america',
  published: true,
  createdAt: '2024-04-25T10:40:42.473Z',
  updatedAt: '2024-04-25T10:40:42.473Z',
};
export const mockRegionDtoEurope = {
  id: 'europe',
  name: 'Europe',
  slug: 'europe',
  published: true,
  createdAt: '2024-04-25T10:40:42.473Z',
  updatedAt: '2024-04-25T10:40:42.473Z',
};
export const mockRegionsDto: RegionDto[] = [
  mockRegionDtoAmerica,
  mockRegionDtoAuO,
  mockRegionDtoAfrica,
  mockRegionDtoMiddleEast,
  mockRegionDtoAsia,
  mockRegionDtoLatAm,
  mockRegionDtoEurope,
];
export const mockRegionAmerica = makeRegionObj(mockRegionDtoAmerica);
export const mockRegionAuO = makeRegionObj(mockRegionDtoAuO);
export const mockRegionAfrica = makeRegionObj(mockRegionDtoAfrica);
export const mockRegionMiddleEast = makeRegionObj(mockRegionDtoMiddleEast);
export const mockRegionAsia = makeRegionObj(mockRegionDtoAsia);
export const mockRegionEurope = makeRegionObj(mockRegionDtoEurope);
