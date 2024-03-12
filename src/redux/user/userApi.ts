import { baseApi } from "../baseApi";
import { ScoutingAppUser } from "./types";

export const USER_API_REDUCER_KEY = "userApi";
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<ScoutingAppUser, string>({
      query: () => ({
        url: "/me",
      }),
      providesTags: ["User"],
      transformResponse: (response: ScoutingAppUser) => {
        return response;
      },
      transformErrorResponse: (response, meta, arg) => {
        return response;
      },
    }),
    signupUser: builder.mutation<
      ScoutingAppUser,
      { email: string; password: string; organizationName: string }
    >({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetCurrentUserQuery, useSignupUserMutation } = userApi;
