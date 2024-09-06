import create from "../../../app/scout-report/create";
import { baseApi } from "../baseApi";
import type { Farm, Grower } from "./types";

export const fieldManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFarms: builder.query<Farm[], String>({
      query: () => ({
        url: `/farms`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data;
      },
      providesTags: ["Farms"],
    }),
    getGrowers: builder.query<Grower[], String>({
      query: () => ({
        url: `/growers`,
        method: "GET",
      }),
      providesTags: ["Growers"],
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
    createFarm: builder.mutation<Farm, Farm>({
      query: (farm) => ({
        url: `/farms`,
        method: "POST",
        data: farm,
      }),
      invalidatesTags: ["Farms"],
    }),
    createGrower: builder.mutation<Grower, Grower>({
      query: (grower) => ({
        url: `/growers`,
        method: "POST",
        data: grower,
      }),
      invalidatesTags: ["Growers", "Farms"],
    }),
    editGrower: builder.mutation<Grower, Grower>({
      query: (grower) => ({
        url: `/growers/${grower.ID}`,
        method: "PUT",
        data: grower,
      }),
      invalidatesTags: ["Growers", "Farms"],
    }),
  }),
  // TODO: Disable this in production
  // overrideExisting: true,
});

export const {
  useGetFarmsQuery,
  useGetGrowersQuery,
  useCreateFarmMutation,
  useCreateGrowerMutation,
  useEditGrowerMutation,
} = fieldManagementApi;
