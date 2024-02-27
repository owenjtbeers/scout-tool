// Redux
import { combineSlices } from "@reduxjs/toolkit";

// Reducer Slices
import { drawingSlice } from "./map/drawingSlice";
import { mapSlice } from "./map/mapSlice";
import { userSlice } from "./user/userSlice";
import { userApi } from "./user/userApi";
import { authApi } from "./auth/authApi";
import { globalSelectionsSlice } from "./globalSelections/globalSelectionsSlice";
import { fieldManagementApi } from "./field-management/fieldManagementApi";

// ROOT REDUCER
export const rootReducer = combineSlices(
  drawingSlice,
  mapSlice,
  globalSelectionsSlice,
  userSlice,
  userApi,
  authApi,
  fieldManagementApi
);
