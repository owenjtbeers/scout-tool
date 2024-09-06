// Redux
import { combineSlices } from "@reduxjs/toolkit";

// Reducer Slices
import { drawingSlice } from "./map/drawingSlice";
import { mapSlice } from "./map/mapSlice";
import { userSlice } from "./user/userSlice";
import { scoutingSlice } from "./scouting/scoutingSlice";
import { globalSelectionsSlice } from "./globalSelections/globalSelectionsSlice";
import { baseApi } from "./baseApi";

// ROOT REDUCER
export const rootReducer = combineSlices(
  drawingSlice,
  scoutingSlice,
  mapSlice,
  globalSelectionsSlice,
  userSlice,
  baseApi
);
