import { createSlice } from "@reduxjs/toolkit";
import { LatLng, Polygon } from "react-native-maps";

export const MAP_DRAWING_REDUCER_KEY = "map-drawing";
export const drawingSlice = createSlice({
  name: MAP_DRAWING_REDUCER_KEY,
  initialState: {
    polygon: [] as Array<LatLng>,
    isDrawing: false,
  },
  reducers: {
    addPointToPolygon: (state, action) => {
      console.log("addPointToPolygon", action.payload);
      state.polygon = [...state.polygon, action.payload];
    },
    clearPolygon: (state) => {
      console.log("clearPolygon");
      console.log(state.polygon);
      state.polygon = [];
    },
    setIsDrawing: (state, action) => {
      state.isDrawing = action.payload;
    },
  },
});
