import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const today = new Date();

type MainTab = "Map" | "List" | "Settings";

interface GlobalSelectionsState {
  grower: string | null;
  field: string | null;
  season: string | null;
  mainTab: MainTab;
}

const initialState: GlobalSelectionsState = {
  grower: null,
  field: null,
  season: today.getFullYear().toString(),
  mainTab: "Map",
};

export const GLOBAL_SELECTIONS_REDUCER_KEY = "global-selections";
export const globalSelectionsSlice = createSlice({
  name: GLOBAL_SELECTIONS_REDUCER_KEY,
  initialState,
  reducers: {
    setGrower: (state, action: PayloadAction<string>) => {
      state.grower = action.payload;
    },
    setField: (state, action: PayloadAction<string>) => {
      state.field = action.payload;
    },
    setSeason: (state, action: PayloadAction<string>) => {
      state.season = action.payload;
    },
  },
});

export const { setGrower, setField, setSeason } = globalSelectionsSlice.actions;
