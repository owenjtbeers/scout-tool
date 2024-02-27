import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Farm, Grower } from "../field-management/types";
import { Field } from "../fields/types";

const today = new Date();

interface GlobalSelectionsState {
  farm: Farm | null;
  grower: Grower | null;
  field: Field | null;
  season: string | null;
}

const initialState: GlobalSelectionsState = {
  grower: null,
  farm: null,
  field: null,
  season: today.getFullYear().toString(),
};

export const GLOBAL_SELECTIONS_REDUCER_KEY = "global-selections";
export const globalSelectionsSlice = createSlice({
  name: GLOBAL_SELECTIONS_REDUCER_KEY,
  initialState,
  reducers: {
    setGrower: (state, action: PayloadAction<Grower | null>) => {
      state.grower = action.payload;
      state.farm = null;
    },
    setFarm: (state, action: PayloadAction<{grower: Grower, farm: Farm}>) => {
      state.farm = action.payload.farm;
      state.grower = action.payload.grower;
    },
    setField: (state, action: PayloadAction<Field>) => {
      state.field = action.payload;
    },
    setSeason: (state, action: PayloadAction<string>) => {
      state.season = action.payload;
    },
  },
});

export const { setGrower, setField, setSeason } = globalSelectionsSlice.actions;
