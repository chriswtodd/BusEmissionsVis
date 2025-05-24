import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RouteFilterModel } from '../../models/routeFilter.js';

export const getRoutesApi = createApi({
  reducerPath: 'getRoutesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://' }),
  endpoints: (build) => ({
    getRoutes: build.query<string, RouteFilterModel>({
      query: (baseUrl) => `${baseUrl}/routes`,
    }),
  }),
})

export const { useGetRoutesQuery } = getRoutesApi