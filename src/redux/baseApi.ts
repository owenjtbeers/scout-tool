import {
  BaseQueryFn,
  createApi,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { APIErrorResponse, axiosBaseQuery } from "./query";
import { ROOT_API_URL } from "../constants/api/server";
import { prepareHeaders as prepareScoutingToolHeaders } from "../utils/network/prepareHeaders";
import { store as scoutingToolStore } from "./store";

export const baseApi = createApi({
  baseQuery: <BaseQueryFn<string | FetchArgs, unknown, APIErrorResponse, {}>>(
    axiosBaseQuery({
      baseUrl: ROOT_API_URL,
      // prepareHeaders: prepareScoutingToolHeaders,
    })
  ),
  tagTypes: [
    "Farms",
    "Growers",
    "Fields",
    "ScoutingReports",
    "Token",
    "User",
    "OrgWeeds",
    "OrgDiseases",
    "OrgInsects",
    "OrgCrops",
    "Crops",
  ],
  endpoints: () => ({}),
});
