import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LatLng, Polygon } from "react-native-maps";

export type DrawingOperation =
  | "add-field"
  | "edit-field"
  | "upload-shapefile"
  | null;

export const MAP_DRAWING_REDUCER_KEY = "map-drawing";
export const drawingSlice = createSlice({
  name: MAP_DRAWING_REDUCER_KEY,
  initialState: {
    polygon: [] as Array<LatLng>,
    isDrawing: false,
    operation: null as null | DrawingOperation,
  },
  reducers: {
    addPointToPolygon: (state, action: PayloadAction<LatLng>) => {
      console.log("addPointToPolygon", action.payload);
      state.polygon = [...state.polygon, action.payload];
    },
    setPolygon: (state, action: PayloadAction<Array<LatLng>>) => {
      state.polygon = action.payload;
    },
    clearPolygon: (state) => {
      console.log("clearPolygon");
      state.polygon = [];
    },
    setIsDrawing: (state, action: PayloadAction<boolean>) => {
      state.isDrawing = action.payload;
    },
    setOperation: (state, action: PayloadAction<DrawingOperation>) => {
      state.operation = action.payload;
    },
  },
});
