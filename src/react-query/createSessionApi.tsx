import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILoggedInData, ILoginCredentials } from '../models/loginModel.tsx';

export const loginApi = createApi({
  reducerPath: '',
  baseQuery: fetchBaseQuery({ 
    baseUrl: "http://",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<ILoggedInData, {url: string, data: ILoginCredentials}>({
      query: ({ url, data }) => ({
        url: `${url}/login`,
        method: "POST",
        data
      })
    }),
  }),
})

export const { useLoginMutation } = loginApi