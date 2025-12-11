import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  AccountCreateApiUrl,
  AppPublicUrl,
  MeUserApiUrl,
  UsersLoginUrl,
  UsersLogoutUrl,
} from '@/config';
import { ReCaptchaFormData } from '@/lib/google/recaptcha-types';
import { UserDto } from '@/payload/app-types';

/**
 * See {@link accountCreateSchema} for this schema validation
 */
export type AccountCreateFormData = ReCaptchaFormData & {
  email: string;
  password: string;
  passwordConfirm?: string;
  legalAgreement: boolean;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: AppPublicUrl,
    credentials: 'include',
    priority: 'high',
    mode: 'cors',
  }),
  keepUnusedDataFor: 3600,
  tagTypes: ['CurrentUser'],
  endpoints: (builder) => ({
    getMeUser: builder.query<{ token?: string; user?: UserDto }, void>({
      query: (_) => ({ url: MeUserApiUrl, credentials: 'include' }),
      providesTags: ['CurrentUser'],
    }),
    login: builder.mutation<{ user?: UserDto }, { email: string; password: string }>({
      query: (body) => ({ url: UsersLoginUrl, method: 'POST', body }),
      invalidatesTags: ['CurrentUser'],
    }),
    logout: builder.mutation<unknown, void>({
      query: () => ({ url: UsersLogoutUrl, method: 'POST' }),
      invalidatesTags: ['CurrentUser'],
    }),
    accountRegister: builder.mutation<{ user?: UserDto }, AccountCreateFormData>({
      query: (userDto) => ({
        url: AccountCreateApiUrl,
        method: 'POST',
        credentials: 'include',
        body: userDto,
      }),
    }),
  }),
});

export const {
  useGetMeUserQuery: useGetMeUser,
  useLoginMutation,
  useLogoutMutation,
  useAccountRegisterMutation,
} = authApi;
