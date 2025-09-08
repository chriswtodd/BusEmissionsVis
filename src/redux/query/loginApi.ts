import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILoggedInData, ILoginCredentials } from '../../models/loginModel.js';

export const loginApi = createApi({
  reducerPath: 'loginReducer',
  baseQuery: fetchBaseQuery({ 
    baseUrl: "",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<ILoggedInData, {url: string, data: ILoginCredentials}>({
      query: ({ url, data }) => ({
        url: `${url}/login`,
        method: 'POST',
        params: {
          useCookies: true
        },
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }),
  }),
})

export const { useLoginMutation } = loginApi