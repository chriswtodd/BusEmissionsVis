import { baseApi } from './baseApi.ts';
import { IApiModel } from '../../models/apiModel.js';
import { Emissions, EmissionsQuery } from '../../models/emissionsModel.js';
import { RoutesModel } from '../../models/routeModel.js';

export const emissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmissions: builder.query<Emissions[], IApiModel<EmissionsQuery>>({
      query: (apiModel) => ({
            url: `${apiModel.baseUrl}/emissions`,
            params: apiModel.model
        }),
        providesTags: ['Emissions']
    }),
    getRoutes: builder.query<RoutesModel, string>({
      query: (baseUrl) => `${baseUrl}/routes`,
      providesTags: ['Routes']
    }),
    updateRoutes: builder.mutation<void, IApiModel<RoutesModel>>({
      query: (update) => ({
          url: `${update.baseUrl}/routes`,
          method: 'PUT',
          body: update.model,
          headers: {
            'Content-Type': 'application/json',
          },
      }),
      invalidatesTags: ['Emissions']
    }),
  }),
})

export const { useGetEmissionsQuery, useGetRoutesQuery, useUpdateRoutesMutation } = emissionsApi