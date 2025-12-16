import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { EsimApiUrl } from '@/config';
import { EsimProduct } from '@/data/esim-product';
import { EsimProductsCollectionId } from '@/payload/collections';

export const esimProductsApi = createApi({
  reducerPath: 'esimProductsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: EsimApiUrl,
  }),
  endpoints: (builder) => ({
    getEsimProductById: builder.query<EsimProduct, string>({
      query: (id) => `/${EsimProductsCollectionId}/${id}`,
    }),
  }),
});

export const { useGetEsimProductByIdQuery } = esimProductsApi;
