import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ScoutingReportForm } from "../../components/scouting/types";
import type { Alias, ObservationTypePrefix } from "./types";

interface ScoutingSliceState {
  draftedReports: { [key: string]: ScoutingReportForm };
  selectedPestHotButton: PestHotButton | null;
  pestHotButtonsQueue: PestHotButton[];
}

const initialState: ScoutingSliceState = {
  draftedReports: {},
  selectedPestHotButton: null,
  pestHotButtonsQueue: [],
};

export interface PestHotButton {
  Alias: Alias;
  type: ObservationTypePrefix;
  color: React.CSSProperties["color"];
}

export const SCOUTING_SLICE_REDUCER_KEY = "scoutingSlice";
export const scoutingSlice = createSlice({
  name: SCOUTING_SLICE_REDUCER_KEY,
  initialState,
  reducers: {
    setPestHotButton: (state, action: PayloadAction<PestHotButton>) => {
      const newQueue = [...state.pestHotButtonsQueue];
      const existingIndex = state.pestHotButtonsQueue.findIndex(
        (button) =>
          button.Alias.ID === action.payload.Alias.ID &&
          button.type === action.payload.type &&
          button.Alias.Name === action.payload.Alias.Name
      );
      if (existingIndex !== -1) {
        // Button is already in Queue remove it, so that it's added to the end
        newQueue.splice(existingIndex, 1);
      } else if (newQueue.length >= 3) {
        newQueue.shift();
      }
      newQueue.push(action.payload);
      return {
        ...state,
        selectedPestHotButton: action.payload,
        pestHotButtonsQueue: newQueue,
      };
    },
    clearPestHotButtons: (state) => {
      return {
        ...state,
        selectedPestHotButton: null,
        pestHotButtonsQueue: [],
      };
    },
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
    clearState: (state) => {
      return initialState;
    },
  },
});

export const { setDraftedReport, removeDraftedReport } = scoutingSlice.actions;
