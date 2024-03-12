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
  }),
});

export const { useGetFarmsQuery, useGetGrowersQuery } = fieldManagementApi;
