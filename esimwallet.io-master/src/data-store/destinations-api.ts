import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { EsimApiUrl } from '@/config';
import { Destination } from '@/data/destination';

export const destinationsApi = createApi({
  reducerPath: 'destinationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: EsimApiUrl,
  }),
  endpoints: (builder) => ({
    getDestinations: builder.query<Destination[], void>({
      query: (_) => '/destinations',
    }),
  }),
});

export const { useGetDestinationsQuery } = destinationsApi;
