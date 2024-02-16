import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareHeaders } from "../../utils/prepareHeaders";
import type { Farm, Grower } from "./types";

export const fieldManagementApi = createApi({
  reducerPath: "fieldManagementApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api", prepareHeaders }),
  endpoints: (builder) => ({
    getFieldManagementInfo: builder.query<[Farm[], Grower[]], String>({
      query: () => `field-management-info/`,
    }),
  }),
});

export const { useGetFieldManagementInfoQuery } = fieldManagementApi;
