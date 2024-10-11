import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FeatureCollection } from "@turf/helpers";
import React from "react";
import { set } from "react-hook-form";
import { LatLng } from "react-native-maps";
import { Alias, ObservationTypePrefix } from "../scouting/types";

export type DrawingOperation =
  | "add-field"
  | "edit-field"
  | "upload-shapefile"
  | null;

interface ColoredShape {
  coordinates: LatLng[];
  strokeColor?: React.CSSProperties["color"];
}
export interface PestPoint {
  type: ObservationTypePrefix;
  color: React.CSSProperties["color"];
  coordinates: LatLng;
  Alias?: Alias;
  addIndex?: number;
  observationAreaId?: number;
}

export type DrawMode = "polygon" | "polyline" | "point" | "pest-point" | null;
interface DrawingState {
  polygons: LatLng[][];
  points: LatLng[];
  pestPoints: PestPoint[];
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
  pestPoints: [],
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
    addPestPoint: (state, action: PayloadAction<PestPoint>) => ({
      ...state,
      pestPoints: [
        ...state.pestPoints,
        { ...action.payload, addIndex: state.pestPoints.length },
      ],
    }),
    setPestPoint: (
      state,
      action: PayloadAction<{ index: number; point: PestPoint }>
    ) => {
      const newPestPoints = [...state.pestPoints];
      newPestPoints[action.payload.index] = action.payload.point;
      return {
        ...state,
        pestPoints: newPestPoints,
      };
    },
    setPestPoints: (state, action: PayloadAction<PestPoint[]>) => ({
      ...state,
      pestPoints: action.payload,
    }),
    undoPestPoint: (state) => {
      const newPestPoints = [...state.pestPoints];
      newPestPoints.pop();
      return {
        ...state,
        pestPoints: newPestPoints,
      };
    },
    clearPestPoints: (state) => ({
      ...state,
      pestPoints: [],
    }),
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
      pestPoints: [],
    }),
    clearState: () => initialState,
  },
});
