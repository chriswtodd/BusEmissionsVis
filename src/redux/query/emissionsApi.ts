import { baseApi } from './baseApi.ts';
import { IApiModel } from '../../models/apiModel.js';
import { Emissions, EmissionsQuery } from '../../models/emissionsModel.js';
import { RoutesModel } from '../../models/routeModel.js';

export const emissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmissions: builder.query<Emissions[], IApiModel<EmissionsQuery>>({
      query: (model) => ({
            url: `${model.baseUrl}/emissions`,
            params: model.model,
            // headers: {
            //   'Authorization': `${model.tokenType} ${model.accessToken}`,
            // },
        }),
        providesTags: ['Emissions']
    }),
    getRoutes: builder.query<RoutesModel, IApiModel<string>>({
      query: (model) => ({
        url: `${model.baseUrl}/routes`,
        // headers: {
        //   'Authorization': `${model.tokenType} ${model.accessToken}`,
        // },
      }),
      providesTags: ['Routes'],
    }),
    updateRoutes: builder.mutation<void, IApiModel<RoutesModel>>({
      query: (update) => ({
          url: `${update.baseUrl}/routes`,
          method: 'PUT',
          body: update.model,
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${update.tokenType} ${update.accessToken}`,
          },
      }),
      invalidatesTags: ['Emissions']
    }),
  }),
})

export const { useGetEmissionsQuery, useGetRoutesQuery, useUpdateRoutesMutation } = emissionsApi