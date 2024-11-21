import { baseApi } from "../baseApi";
import { ScoutingAppUser } from "./types";
import { APIResponse } from "../query";

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
      APIResponse<{ user: ScoutingAppUser; token: string }>,
      {
        email: string;
        password: string;
        organizationName: string;
        firstName: string;
        lastName: string;
      }
    >({
      query: (data) => ({
        url: "/users/signup",
        method: "POST",
        data,
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
    updateTutorialProgress: builder.mutation<
      APIResponse<ScoutingAppUser>,
      {
        hasSetupGrower?: boolean;
        hasSetupCrops?: boolean;
        hasSetupPests?: boolean;
      }
    >({
      query: (data) => ({
        url: "/organization/tutorial-progress",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  // TODO: Disable in production
  // overrideExisting: true,
});

export const { useGetCurrentUserQuery, useSignupUserMutation, useUpdateTutorialProgressMutation } = userApi;
