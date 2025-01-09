import { baseApi } from "../baseApi";
import { Field } from "./types";
import type { APIResponse } from "../query";

export const fieldsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFields: build.query<
      APIResponse<Field[]>,
      {
        growerId: number;
        farmId: number;
        withActiveBoundary: boolean | undefined;
        withCrops: boolean | undefined;
      }
    >({
      query: (params) => ({
        url: "/fields",
        method: "GET",
        params,
      }),
      providesTags: ["Fields", "OrgCrops"],
    }),
    createField: build.mutation<Field, Partial<Field>>({
      query: (data) => ({
        url: "/fields",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Fields"],
    }),
    getFieldDetail: build.query<
      APIResponse<Field>,
      {
        fieldId: number;
      }
    >({
      query: (params) => ({
        url: `/fields/${params.fieldId}`,
        method: "GET",
      }),
    }),
    deleteField: build.mutation<APIResponse<{}>, { fieldId: number }>({
      query: (params) => ({
        url: `/fields/${params.fieldId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Fields"],
    }),
  }),
  // TODO: Disable this in production
  // overrideExisting: true,
});

export const {
  useGetFieldsQuery,
  useCreateFieldMutation,
  useGetFieldDetailQuery,
  useDeleteFieldMutation,
} = fieldsApi;
