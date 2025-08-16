import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'emissionsReducer',
    baseQuery: fetchBaseQuery({ baseUrl: `https://`, }),
    tagTypes: ["Emissions", "Routes"],
    endpoints: () => ({}),
  });