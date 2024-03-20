import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FeatureCollection } from "@turf/helpers";
import { LatLng } from "react-native-maps";

export type DrawingOperation =
  | "add-field"
  | "edit-field"
  | "upload-shapefile"
  | null;

interface DrawingState {
  polygon: Array<LatLng>;
  tempGeoJSON: FeatureCollection | null;
  isDrawing: boolean;
  operation: DrawingOperation;
}

const initialState: DrawingState = {
  polygon: [],
  tempGeoJSON: null,
  isDrawing: false,
  operation: null,
};

export const MAP_DRAWING_REDUCER_KEY = "map-drawing";
export const drawingSlice = createSlice({
  name: MAP_DRAWING_REDUCER_KEY,
  initialState,
  reducers: {
    addPointToPolygon: (state, action: PayloadAction<LatLng>) => ({
      ...state,
      polygon: [...state.polygon, action.payload],
    }),
    setPolygon: (state, action: PayloadAction<Array<LatLng>>) => ({
      ...state,
      polygon: action.payload,
    }),
    clearPolygon: (state) => ({
      ...state,
      polygon: [],
    }),
    setIsDrawing: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isDrawing: action.payload,
    }),
    setOperation: (state, action: PayloadAction<DrawingOperation>) => ({
      ...state,
      operation: action.payload,
    }),
    setTempGeoJSON: (state, action: PayloadAction<FeatureCollection>) => ({
      ...state,
      tempGeoJSON: action.payload,
    }),
    clearTempGeoJSON: (state) => ({
      ...state,
      tempGeoJSON: null,
    }),
  },
});
