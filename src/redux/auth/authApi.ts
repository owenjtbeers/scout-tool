import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LOGIN_URL_PATH } from "../../constants/api/server";

// Define your API endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: LOGIN_URL_PATH }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { username: string; password: string }) => ({
        url: "/",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
} = authApi;
