import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ScoutingReportForm } from "../../components/scouting/types";

interface ScoutingSliceState {
  draftedReports: { [key: string]: ScoutingReportForm };
}

const initialState: ScoutingSliceState = {
  draftedReports: {},
};

export const SCOUTING_SLICE_REDUCER_KEY = "scoutingSlice";
export const scoutingSlice = createSlice({
  name: SCOUTING_SLICE_REDUCER_KEY,
  initialState,
  reducers: {
    setDraftedReport: (
      state,
      action: PayloadAction<{ key: string; report: ScoutingReportForm }>
    ) => ({
      ...state,
      draftedReports: {
        ...state.draftedReports,
        [action.payload.key]: action.payload.report,
      },
    }),
    removeDraftedReport: (state, action: PayloadAction<string>) => {
      const newState = {
        ...state,
        draftedReports: { ...state.draftedReports },
      };
      delete newState.draftedReports[action.payload];
      return newState;
    },
  },
});

export const { setDraftedReport, removeDraftedReport } = scoutingSlice.actions;
