import { baseApi } from "../baseApi";
import { Field } from "./types";

type FieldResponse = {
  data: Field[];
  message: string;
};

export const fieldsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFields: build.query<
      FieldResponse,
      { growerId: number; farmId: number; withBoundaries: boolean | undefined }
    >({
      query: (params) => ({
        url: "/fields",
        method: "GET",
        params,
      }),
      transformResponse: (response: { data: Field[]; message: string }) => {
        return response;
      },
      providesTags: ["Fields"],
    }),
    createField: build.mutation<Field, Partial<Field>>({
      query: (data) => ({
        url: "/fields",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Fields"],
    }),
  }),
});

export const { useGetFieldsQuery, useCreateFieldMutation } = fieldsApi;
