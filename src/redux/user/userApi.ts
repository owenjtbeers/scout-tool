import { baseApi } from "../baseApi";
import { ScoutingAppUser } from "./types";

export const USER_API_REDUCER_KEY = "userApi";
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<
      {
        data: ScoutingAppUser;
        message: string;
      },
      string
    >({
      query: () => ({
        url: "/users/me",
      }),
      providesTags: ["User"],
    }),
    signupUser: builder.mutation<
      ScoutingAppUser,
      { email: string; password: string; organizationName: string }
    >({
      query: (body) => ({
        url: "/users/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getOrgUsers: builder.query<
      {
        data: ScoutingAppUser[];
        message: string;
      },
      string
    >({
      query: (organizationId) => ({
        url: `/users/organization/${organizationId}`,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetCurrentUserQuery, useSignupUserMutation } = userApi;
