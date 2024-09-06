import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Farm, Grower } from "../field-management/types";
import { Field } from "../fields/types";

const today = new Date();

interface GlobalSelectionsState {
  farm: Farm | null;
  grower: Grower | null;
  field: Field | null;
  season: string | null;
  shouldZoomToBbox: boolean;
}

const initialState: GlobalSelectionsState = {
  grower: null,
  farm: null,
  field: null,
  season: today.getFullYear().toString(),
  // TODO: This should probably belong on the map to be honest
  // but for now it's here because I don't want to do a large refactor just to have this be clean
  shouldZoomToBbox: false,
};

export const GLOBAL_SELECTIONS_REDUCER_KEY = "global-selections";
export const globalSelectionsSlice = createSlice({
  name: GLOBAL_SELECTIONS_REDUCER_KEY,
  initialState,
  reducers: {
    setGrower: (state, action: PayloadAction<Grower | null>) => ({
      ...state,
      grower: action.payload,
      farm: null,
      shouldZoomToBbox: true,
    }),
    setFarm: (
      state,
      action: PayloadAction<{ grower: Grower; farm: Farm | null }>
    ) => ({
      ...state,
      farm: action.payload.farm,
      grower: action.payload.grower,
      shouldZoomToBbox: true,
    }),
    setField: (state, action: PayloadAction<Field | null>) => ({
      ...state,
      field: action.payload,
    }),
    setSeason: (state, action: PayloadAction<string>) => ({
      ...state,
      season: action.payload,
    }),
    setShouldZoomToBbox: (state, action: PayloadAction<boolean>) => ({
      ...state,
      shouldZoomToBbox: action.payload,
    }),
    clearState: (state) => {
      return initialState;
    },
  },
});

export const { setGrower, setField, setSeason } = globalSelectionsSlice.actions;
