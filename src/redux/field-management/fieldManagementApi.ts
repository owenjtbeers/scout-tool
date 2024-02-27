import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../query";
import { prepareHeaders } from "../../utils/prepareHeaders";
import type { Farm, Grower } from "./types";
import { ROOT_API_URL } from "../../constants/api/server";

type ServerResponse = {
  message: string;
  data: any;
};

export const fieldManagementApi = createApi({
  reducerPath: "fieldManagementApi",
  baseQuery: axiosBaseQuery({
    baseUrl: ROOT_API_URL as string,
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    getFarms: builder.query<Farm[], String>({
      query: () => ({
        url: `api/farms`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
    getGrowers: builder.query<Grower[], String>({
      query: () => ({
        url: `api/growers`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
  }),
});

export const { useGetFarmsQuery, useGetGrowersQuery } = fieldManagementApi;
