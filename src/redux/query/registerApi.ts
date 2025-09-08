import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILoggedInData, IResgisterCredentials } from '../../models/loginModel.js';

export const registerApi = createApi({
  reducerPath: 'registerReducer',
  baseQuery: fetchBaseQuery({ 
    baseUrl: "",
  }),
  endpoints: (builder) => ({
    register: builder.mutation<ILoggedInData, {url: string, data: IResgisterCredentials}>({
      query: ({ url, data }) => ({
        url: `${url}/register`,
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }),
  }),
})

export const { useRegisterMutation } = registerApi