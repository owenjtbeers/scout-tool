import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FeatureCollection } from "@turf/helpers";
import React from "react";
import { set } from "react-hook-form";
import { LatLng } from "react-native-maps";

export type DrawingOperation =
  | "add-field"
  | "edit-field"
  | "upload-shapefile"
  | null;

interface ColoredShape {
  coordinates: LatLng[];
  strokeColor?: React.CSSProperties["color"];
}
export type DrawMode = "polygon" | "polyline" | "point" | null;
interface DrawingState {
  polygons: LatLng[][];
  points: LatLng[];
  polylines: ColoredShape[];
  tempGeoJSON: FeatureCollection | null;
  isDrawing: boolean;
  operation: DrawingOperation;
  drawMode: DrawMode;
  drawColor: React.CSSProperties["color"];
}

const initialState: DrawingState = {
  polygons: [],
  points: [],
  polylines: [],
  drawColor: "red",
  tempGeoJSON: null,
  isDrawing: false,
  drawMode: null,
  operation: null,
};

export const MAP_DRAWING_REDUCER_KEY = "map-drawing";
export const drawingSlice = createSlice({
  name: MAP_DRAWING_REDUCER_KEY,
  initialState,
  reducers: {
    addPointToPolygon: (
      state,
      action: PayloadAction<{ index: number; point: LatLng }>
    ) => {
      const newPolygons = [...state.polygons];
      if (!newPolygons[action.payload.index]) {
        newPolygons[action.payload.index] = [];
      }
      newPolygons[action.payload.index] = [
        ...newPolygons[action.payload.index],
        action.payload.point,
      ];
      return {
        ...state,
        polygons: newPolygons,
      };
    },
    setPointOfPolygon: (
      state,
      action: PayloadAction<{
        index: number;
        pointIndex: number;
        point: LatLng;
      }>
    ) => {
      const newPolygons = [...state.polygons];
      newPolygons[action.payload.index] = [
        ...newPolygons[action.payload.index],
      ];
      newPolygons[action.payload.index][action.payload.pointIndex] =
        action.payload.point;
      return {
        ...state,
        polygons: newPolygons,
      };
    },
    addPoint: (state, action: PayloadAction<LatLng>) => ({
      ...state,
      points: [...state.points, action.payload],
    }),
    setPoint: (
      state,
      action: PayloadAction<{ index: number; point: LatLng }>
    ) => {
      const newPoints = [...state.points];
      newPoints[action.payload.index] = action.payload.point;
      return {
        ...state,
        points: newPoints,
      };
    },
    addPolyline: (state, action: PayloadAction<ColoredShape>) => ({
      ...state,
      polylines: [...state.polylines, action.payload],
    }),
    setPolylines: (state, action: PayloadAction<ColoredShape[]>) => ({
      ...state,
      polylines: action.payload,
    }),
    undoPolyline: (state) => {
      const newPolylines = [...state.polylines];
      newPolylines.pop();
      return {
        ...state,
        polylines: newPolylines,
      };
    },
    clearPolylines: (state) => ({
      ...state,
      polylines: [],
    }),
    clearPolygons: (state) => ({
      ...state,
      polygons: [],
    }),
    setIsDrawing: (
      state: DrawingState,
      action: PayloadAction<{ drawMode: DrawMode; isDrawing: boolean }>
    ) => ({
      ...state,
      isDrawing: action.payload.isDrawing,
      drawMode: action.payload.drawMode,
    }),
    setDrawMode: (state, action: PayloadAction<DrawMode>) => ({
      ...state,
      drawMode: action.payload,
    }),
    setOperation: (state, action: PayloadAction<DrawingOperation>) => ({
      ...state,
      operation: action.payload,
    }),
    setTempGeoJSON: (state, action: PayloadAction<FeatureCollection>) => ({
      ...state,
      tempGeoJSON: action.payload,
    }),
    setDrawColor: (
      state,
      action: PayloadAction<React.CSSProperties["color"]>
    ) => ({
      ...state,
      drawColor: action.payload,
    }),
    clearTempGeoJSON: (state) => ({
      ...state,
      tempGeoJSON: null,
    }),
    clearAllShapes: (state) => ({
      ...state,
      polygons: [],
      points: [],
      polylines: [],
    }),
    clearState: () => initialState,
  },
});
