import { baseApi } from "../baseApi";
import type { ScoutingReport, OrgWeed } from "./types";
import type { APIResponse } from "../query";

export const scoutingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getScoutingReports: build.query<
      APIResponse<ScoutingReport[]>,
      { growerId: number; farmId: number; start_date: string; end_date: string }
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
      invalidatesTags: ["ScoutingReports", "OrgWeeds"],
    }),
    getOrgWeeds: build.query<APIResponse<OrgWeed[]>, {}>({
      query: (params) => ({
        url: "/scouting/org-weed",
        method: "GET",
        params,
      }),
      providesTags: ["OrgWeeds"],
    }),
    getScoutReportDetail: build.query<
      APIResponse<ScoutingReport>,
      { id: number }
    >({
      query: (params) => ({
        url: `/scouting/scout-report/${params.id}`,
        method: "GET",
      }),
      providesTags: ["ScoutingReports"]
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
      invalidatesTags: ["ScoutingReports", "OrgWeeds"],
    }),
  }),
});

export const {
  useGetScoutingReportsQuery,
  useCreateScoutingReportMutation,
  useUpdateScoutingReportMutation,
  useGetScoutReportDetailQuery,
  useGetOrgWeedsQuery,
} = scoutingApi;
