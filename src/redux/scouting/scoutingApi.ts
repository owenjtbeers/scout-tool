import { baseApi } from "../baseApi";
import type { ScoutingReport, OrgWeed, OrgDisease, OrgInsect } from "./types";
import type { APIResponse } from "../query";

export const scoutingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getScoutingReports: build.query<
      APIResponse<ScoutingReport[]>,
      {
        growerId: number | null;
        farmId: number | null;
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
      ScoutingReport,
      Partial<ScoutingReport>
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
      APIResponse<ScoutingReport>,
      { id: number }
    >({
      query: (params) => ({
        url: `/scouting/scout-report/${params.id}`,
        method: "GET",
      }),
      providesTags: ["ScoutingReports"],
    }),
    updateScoutingReport: build.mutation<
      APIResponse<ScoutingReport>,
      { id: number; data: ScoutingReport }
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
} = scoutingApi;
