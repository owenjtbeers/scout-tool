import React, { useCallback, useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import MapView, {
  Polygon,
  Marker,
  Geojson,
  LatLng,
  Polyline,
} from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import {
  MAP_DRAWING_REDUCER_KEY,
  drawingSlice,
} from "../../../redux/map/drawingSlice";
import { RootState } from "../../../redux/store";
import { colors } from "../../../constants/styles";
import { Dispatch } from "redux";

// This component is solely responsible for rendering the current drawn shapes on the map
// This is kept separate from the other shapes to prevent re-rendering of the entire map
export const ScoutingDrawingManager = (props: {
  mapRef: React.RefObject<MapView>;
}) => {
  const dispatch = useDispatch();
  const { mapRef } = props;
  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );
  const polygons = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].polygons
  );
  // const polylines = useSelector(
  //   (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].polylines
  // );
  const points = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].points
  );

  return polygons.length !== null ? (
    <>
      {Polygons(polygons)}
      {/* {Polylines(polylines)} */}
      {Points(points, dispatch)}
    </>
  ) : null;
};

const Polylines = (polylines: LatLng[][]) => {
  if (!polylines || polylines?.length === 0) {
    return null;
  }
  return polylines.map((line, index) => {
    return (
      <Polyline
        key={`Polyline-${index}`}
        coordinates={line}
        strokeColor={colors.primary}
        strokeWidth={2}
      />
    );
  });
};

const Polygons = (polygons: LatLng[][]) => {
  if (!polygons || polygons?.length === 0) {
    return null;
  }
  return polygons.map((polygon, index) => {
    if (polygon.length === 1) {
      return <Marker key={`Marker-${index}`} coordinate={polygon[0]} />;
    }
    return (
      <Polygon
        key={`Polygon-${index}`}
        coordinates={polygon}
        fillColor={colors.tertiary}
        strokeColor={colors.primary}
        strokeWidth={2}
      />
    );
  });
};

const Points = (points: LatLng[], dispatch: Dispatch) => {
  if (!points || points?.length === 0) {
    return null;
  }
  return points.map((point, index) => {
    return (
      <Marker
        key={`Marker-${index}`}
        coordinate={point}
        draggable
        tracksViewChanges={false}
        title={`${index + 1}`}
        onDragEnd={(event) => {
          dispatch(
            drawingSlice.actions.setPoint({
              index,
              point: event.nativeEvent.coordinate,
            })
          );
        }}
      ></Marker>
    );
  });
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  infoText: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
