import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./query";
import { ROOT_API_URL } from "../constants/api/server";
import { prepareHeaders } from "../utils/prepareHeaders";

export const baseApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: ROOT_API_URL,
    prepareHeaders: prepareHeaders,
  }),
  tagTypes: ["Farms", "Growers", "Fields", "Token", "User"],
  endpoints: () => ({}),
});
