import React, { useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Polygon } from "react-native-maps";
import { useSelector } from "react-redux";
import {
  MAP_DRAWING_REDUCER_KEY,
  drawingSlice,
} from "../redux/map/drawingSlice";
import { RootState } from "../redux/store";

const DrawingManager = (props: { mapRef: React.RefObject<MapView> }) => {
  const { mapRef } = props;
  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );

  const polygon = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].polygon
  );

  return isDrawing && polygon.length ? (
      <Polygon
        coordinates={polygon}
        fillColor="blue"
        strokeColor="blue"
        strokeWidth={5}
      />
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  clearButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "red",
    padding: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DrawingManager;
