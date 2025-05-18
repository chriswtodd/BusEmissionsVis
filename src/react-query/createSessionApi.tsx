import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILoggedInData, ILoginCredentials } from '../models/loginModel.tsx';

export const loginApi = createApi({
  reducerPath: '',
  baseQuery: fetchBaseQuery({ 
    baseUrl: "/",
    method: "POST"
  }),
  endpoints: (builder) => ({
    login: builder.mutation<ILoggedInData, ILoginCredentials>({
      query: (body) => ({
        url: `/login`,
        body
      })
    }),
  }),
})

export const { useLoginMutation } = loginApi