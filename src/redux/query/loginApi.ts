import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IAuthGoogleUserInfo, IAuthWho } from '../../models/loginModel.js';

export const loginApi = createApi({
  reducerPath: 'loginReducer',
  baseQuery: fetchBaseQuery({ 
    baseUrl: "",
  }),
  endpoints: (builder) => ({
    loginGoogle: builder.mutation<IAuthGoogleUserInfo, { url: string, callback: string }>({
      query: ({ url, callback }) => ({
        url: `${url}/auth/google?callback=${callback}`,
        method: 'GET',
      })
    }),
    logout: builder.mutation<IAuthGoogleUserInfo, { url: string, callback: string }>({
      query: ({ url, callback }) => ({
        url: `${url}/auth/logout?callback=${callback}`,
        method: 'POST',
      })
    }),
    userInfo: builder.mutation<IAuthGoogleUserInfo, { url: string }>({
      query: ({ url }) => ({
        url: `${url}/auth/userInfo`,
        method: 'GET',
      })
    }),
    who: builder.query<IAuthWho, { url: string }>({
      query: ({ url }) => ({
        url: `${url}/auth/who`,
        method: 'GET',
      })
    }),
  }),
})

export const { useLoginGoogleMutation, useLogoutMutation, useUserInfoMutation, useWhoQuery } = loginApi