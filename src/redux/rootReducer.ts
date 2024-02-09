// Redux
import { combineSlices } from "@reduxjs/toolkit"

// Reducer Slices
import { drawingSlice } from "./map/drawingSlice"
import { globalSelectionsSlice } from "./globalSelections/globalSelectionsSlice"



// ROOT REDUCER
export const rootReducer = combineSlices(
    drawingSlice,
    globalSelectionsSlice
)
