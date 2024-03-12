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
        // Transform the json on the ActiveBoundary for each field
        if (response && response.data) {
          response?.data.forEach((field) => {
            if (field.ActiveBoundary) {
              console.log("Field ActiveBoundary", field.ActiveBoundary);
            }
          });
        }
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
