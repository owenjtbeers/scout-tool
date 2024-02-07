// Redux
import { combineSlices } from "@reduxjs/toolkit"

// Reducer Slices
import { drawingSlice } from "./map/drawingSlice"


// ROOT REDUCER
export const rootReducer = combineSlices(
    drawingSlice
)
