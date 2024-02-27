import { createApi } from "@reduxjs/toolkit/query/react";
import { LOGIN_URL_PATH, ROOT_API_AUTH_PATH } from "../../constants/api/server";
import { axiosBaseQuery } from "../query";
import { prepareHeaders } from "../../utils/prepareHeaders";

// Define your API endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({ baseUrl: ROOT_API_AUTH_PATH, prepareHeaders }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "/login",
        method: "POST",
        data: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    validate: builder.mutation({
      query: () => ({
        url: "/validate",
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useLoginMutation, useValidateMutation } = authApi;
