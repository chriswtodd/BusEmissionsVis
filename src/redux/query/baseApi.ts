import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'emissionsReducer',
    baseQuery: fetchBaseQuery({ 
      baseUrl: '', 
      credentials: 'include',
    }),
    tagTypes: ["Emissions", "Routes"],
    endpoints: () => ({}),
  });