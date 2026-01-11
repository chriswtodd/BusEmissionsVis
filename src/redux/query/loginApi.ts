import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IAuthGoogleUserInfo, IAuthWho } from '../../models/loginModel.js';

export const loginApi = createApi({
  reducerPath: 'loginReducer',
  baseQuery: fetchBaseQuery({ 
    baseUrl: "",
  }),
  endpoints: (builder) => ({
    userInfo: builder.mutation<IAuthGoogleUserInfo, { url: string }>({
      query: ({ url }) => ({
        url: `${url}/api/auth/userInfo`,
        method: 'GET',
      })
    }),
    who: builder.query<IAuthWho, { url: string }>({
      query: ({ url }) => ({
        url: `${url}/api/auth/who`,
        method: 'GET',
      })
    }),
  }),
})

export const {  useUserInfoMutation, useWhoQuery } = loginApi