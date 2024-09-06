import { baseApi } from "../baseApi";
import type { APIResponse } from "../query";
import type { FieldCrop, OrgCrop } from "./types";

export const cropsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrgCrops: build.query<APIResponse<OrgCrop[]>, {}>({
      query: () => ({
        url: "/crops",
        method: "GET",
      }),
      providesTags: ["Crops"],
    }),
    updateFieldCrops: build.mutation({
      query: (args: { fieldId: number; data: FieldCrop[] }) => {
        console.log("data", args);
        return {
          url: `/crops/${args.fieldId}/field-crop`,
          method: "POST",
          data: { FieldCrops: args.data },
        };
      },
      invalidatesTags: ["Crops"],
      // transformErrorResponse: (response: APIErrorResponse) => {
      //   return response.data;
      // },
    }),
    getFieldCropsForField: build.query<
      APIResponse<FieldCrop[]>,
      { fieldId: number }
    >({
      query: (params) => {
        console.log(params);
        return {
          url: `/crops/${params.fieldId}/field-crop`,
          method: "GET",
        };
      },
    }),
    deleteFieldCrop: build.mutation({
      query: (data: FieldCrop) => ({
        url: `/crops/field-crop/${data.ID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Crops"],
    }),
  }),
  // TODO: Disable this in production
  // overrideExisting: true,
});

export const {
  useGetOrgCropsQuery,
  useUpdateFieldCropsMutation,
  useGetFieldCropsForFieldQuery,
} = cropsApi;
