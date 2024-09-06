// Redux
import { combineSlices, Dispatch } from "@reduxjs/toolkit";

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

export const clearState = (dispatch: Dispatch) => {
  dispatch(drawingSlice.actions.clearState());
  dispatch(scoutingSlice.actions.clearState());
  dispatch(mapSlice.actions.clearState());
  dispatch(globalSelectionsSlice.actions.clearState());
  dispatch(userSlice.actions.clearState());
};
