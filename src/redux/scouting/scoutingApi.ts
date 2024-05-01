import { baseApi } from "../baseApi";
import type { ScoutingReport, OrgWeed } from "./types";

type ScoutingReportResponse = {
  data: ScoutingReport[];
  message: string;
};

type OrgWeedsResponse = {
  data: OrgWeed[];
  message: string;
};

export const scoutingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getScoutingReports: build.query<
      ScoutingReportResponse,
      { growerId: number; farmId: number; dateRange?: [string, string] }
    >({
      query: (params) => ({
        url: "/scouting/scout-report",
        method: "GET",
        params,
      }),
      transformResponse: (response: ScoutingReportResponse) => {
        return response;
      },
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
    getOrgWeeds: build.query<OrgWeedsResponse, {}>({
      query: (params) => ({
        url: "/scouting/org-weed",
        method: "GET",
        params,
      }),
      providesTags: ["OrgWeeds"],
    }),
  }),
});

export const {
  useGetScoutingReportsQuery,
  useCreateScoutingReportMutation,
  useGetOrgWeedsQuery,
} = scoutingApi;
