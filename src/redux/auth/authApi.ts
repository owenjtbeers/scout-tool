import { baseApi } from "../baseApi";

// Define your API endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Token"],
    }),
    validate: builder.mutation({
      query: () => ({
        url: "/auth/validate",
        method: "GET",
      }),
      invalidatesTags: ["Token"],
    }),
    resendVerificationEmail: builder.mutation({
      query: (email: string) => ({
        url: "/auth/resend-verification-email",
        method: "POST",
        data: { email },
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useValidateMutation,
  useResendVerificationEmailMutation,
} = authApi;
