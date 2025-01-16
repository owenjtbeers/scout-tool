import { baseApi } from "../baseApi";
import type {
  APIScoutingReport,
  OrgWeed,
  OrgDisease,
  OrgInsect,
} from "./types";
import type { APIResponse } from "../query";

export const scoutingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getScoutingReports: build.query<
      APIResponse<APIScoutingReport[]>,
      {
        grower_id: number | null;
        farm_id: number | null;
        start_date: string;
        end_date: string;
      }
    >({
      query: (params) => ({
        url: "/scouting/scout-report",
        method: "GET",
        params,
      }),
      providesTags: ["ScoutingReports"],
    }),
    createScoutingReport: build.mutation<
      APIScoutingReport,
      Partial<APIScoutingReport>
    >({
      query: (data) => ({
        url: "/scouting/scout-report",
        method: "POST",
        data,
      }),
      invalidatesTags: [
        "ScoutingReports",
        "OrgWeeds",
        "OrgDiseases",
        "OrgInsects",
      ],
    }),
    getOrgWeeds: build.query<APIResponse<OrgWeed[]>, {}>({
      query: (params) => ({
        url: "/scouting/org-weed",
        method: "GET",
        params,
      }),
      providesTags: ["OrgWeeds"],
    }),
    getOrgDiseases: build.query<APIResponse<OrgDisease[]>, {}>({
      query: (params) => ({
        url: "/scouting/org-disease",
        method: "GET",
        params,
      }),
      providesTags: ["OrgDiseases"],
    }),
    getOrgInsects: build.query<APIResponse<OrgInsect[]>, {}>({
      query: (params) => ({
        url: "/scouting/org-insect",
        method: "GET",
        params,
      }),
      providesTags: ["OrgInsects"],
    }),
    getScoutReportDetail: build.query<
      APIResponse<APIScoutingReport>,
      { id: number }
    >({
      query: (params) => ({
        url: `/scouting/scout-report/${params.id}`,
        method: "GET",
      }),
      providesTags: ["ScoutingReports"],
    }),
    updateScoutingReport: build.mutation<
      APIResponse<APIScoutingReport>,
      { id: number; data: APIScoutingReport }
    >({
      query: ({ id, data }) => ({
        url: `/scouting/scout-report/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [
        "ScoutingReports",
        "OrgWeeds",
        "OrgDiseases",
        "OrgInsects",
      ],
    }),
    deleteScoutingReport: build.mutation<
      APIResponse<APIScoutingReport>,
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/scouting/scout-report/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ScoutingReports"],
    }),
    createOrgWeed: build.mutation<APIResponse<OrgWeed>, Partial<OrgWeed>>({
      query: (data) => ({
        url: "/scouting/org-weed",
        method: "POST",
        data,
      }),
      invalidatesTags: ["OrgWeeds"],
    }),
  }),
});

export const {
  useGetScoutingReportsQuery,
  useCreateScoutingReportMutation,
  useUpdateScoutingReportMutation,
  useGetScoutReportDetailQuery,
  useGetOrgWeedsQuery,
  useGetOrgDiseasesQuery,
  useGetOrgInsectsQuery,
  useCreateOrgWeedMutation,
  useDeleteScoutingReportMutation,
} = scoutingApi;
