import { baseApi } from "../baseApi";
import type { APIResponse } from "../query";
import type { FieldCrop, OrgCrop, Crop } from "./types";

export const cropsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrgCrops: build.query<APIResponse<OrgCrop[]>, {}>({
      query: () => ({
        url: "/crops",
        method: "GET",
      }),
      providesTags: ["OrgCrops"],
    }),
    createOrgCrop: build.mutation<APIResponse<OrgCrop>, { Name: string }>({
      query: (data) => ({
        url: "/crops/org-crop",
        method: "POST",
        data,
      }),
      invalidatesTags: ["OrgCrops"],
    }),
    editOrgCrop: build.mutation<
      APIResponse<OrgCrop>,
      { ID: number; Name: string }
    >({
      query: (data) => ({
        url: `/crops/org-crop/${data.ID}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["OrgCrops"],
    }),
    deleteOrgCrop: build.mutation<APIResponse<void>, number>({
      query: (cropId) => ({
        url: `/crops/org-crop/${cropId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OrgCrops"],
    }),
    updateFieldCrops: build.mutation({
      query: (args: { fieldId: number; data: FieldCrop[] }) => {
        return {
          url: `/crops/${args.fieldId}/field-crop`,
          method: "POST",
          data: { FieldCrops: args.data },
        };
      },
      invalidatesTags: ["OrgCrops"],
      // transformErrorResponse: (response: APIErrorResponse) => {
      //   return response.data;
      // },
    }),
    getFieldCropsForField: build.query<
      APIResponse<FieldCrop[]>,
      { fieldId: number }
    >({
      query: (params) => {
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
      invalidatesTags: ["OrgCrops"],
    }),
    getGenericCropList: build.query<APIResponse<Crop[]>, string>({
      query: () => ({
        url: "/crops/generic",
        method: "GET",
      }),
    }),
  }),
  // TODO: Disable this in production
  // overrideExisting: true,
});

export const {
  useGetOrgCropsQuery,
  useCreateOrgCropMutation,
  useDeleteOrgCropMutation,
  useEditOrgCropMutation,
  useDeleteFieldCropMutation,
  useUpdateFieldCropsMutation,
  useGetGenericCropListQuery,
  useGetFieldCropsForFieldQuery,
} = cropsApi;
