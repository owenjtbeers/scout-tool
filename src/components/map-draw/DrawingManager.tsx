import React from "react";
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
} from "../../redux/map/drawingSlice";
import { RootState } from "../../redux/store";
import { colors } from "../../constants/styles";
import { DEFAULT_POLYLINE_STROKE_WIDTH } from "../../constants/constants";
import { DrawingPestPoints } from "./pest-points/DrawingPestPoints";

/**
 * This component is responsible for rendering all the shapes drawn on the map
 * This component DOES NOT HANDLE the input for drawing shapes
 * @param props
 * @returns all the currently drawn shapes on the map
 */
export const DrawingManager = (props: { mapRef: React.RefObject<MapView> }) => {
  const { mapRef } = props;
  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );

  const tempGeoJSON = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].tempGeoJSON
  );

  return (
    <>
      <DrawingPolygons isDrawing={isDrawing} />
      <DrawingPoints isDrawing={isDrawing} />
      <DrawingPolylines isDrawing={isDrawing} />
      <DrawingPestPoints isDrawing={isDrawing} />
      {tempGeoJSON !== null && (
        <Geojson
          key={"tempGeoJSON"}
          // @ts-ignore TODO: Figure out how to resolve this between the two libraries
          geojson={tempGeoJSON}
          strokeColor={"lightblue"}
          fillColor={colors.selectedFieldBoundaryFill}
        />
      )}
    </>
  );
};
export const DrawingPolygons = (props: { isDrawing: boolean }) => {
  const polygons = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].polygons
  );
  const { isDrawing } = props;
  return (
    <>
      {polygons?.length > 0 &&
        polygons.map((polygonPoints, indexPolygon) => {
          return polygonPoints.map((point, indexPoint) => {
            return (
              <DrawingPointForPolygon
                key={`dp-${indexPolygon}-${indexPoint}`}
                point={point}
                indexOfPoint={indexPoint}
                indexOfPolygon={indexPolygon}
                isDrawing={isDrawing}
              />
            );
          });
        })}
      {polygons.length > 0 && (
        <Polygon
          coordinates={polygons[0]}
          fillColor={colors.selectedFieldBoundaryFill}
          strokeColor="lightblue"
          strokeWidth={5}
          lineDashPattern={[7, 1]}
        />
      )}
    </>
  );
};

export const DrawingPointForPolygon = (props: {
  point: LatLng;
  isDrawing: boolean;
  indexOfPolygon: number;
  indexOfPoint: number;
}) => {
  const dispatch = useDispatch();
  const { point, indexOfPolygon, indexOfPoint, isDrawing } = props;
  return (
    <Marker
      anchor={{ x: 0.5, y: 0.5 }}
      coordinate={point}
      draggable
      key={`MarkerPolygon${indexOfPolygon}-${indexOfPoint}`}
      tracksViewChanges={false}
      onDragEnd={(event) => {
        dispatch(
          drawingSlice.actions.setPointOfPolygon({
            index: indexOfPolygon,
            pointIndex: indexOfPoint,
            point: event.nativeEvent.coordinate,
          })
        );
      }}
      onPress={() => {
        // Close polygon
        if (indexOfPoint === 0) {
          dispatch(
            drawingSlice.actions.addPointToPolygon({
              index: indexOfPolygon,
              point: point,
            })
          );
          dispatch(
            drawingSlice.actions.setIsDrawing({
              isDrawing: false,
              drawMode: null,
            })
          );
        }
      }}
    >
      <TouchableOpacity
        style={
          indexOfPoint === 0 && isDrawing
            ? { ...styles.circle, backgroundColor: "orange" }
            : styles.circle
        }
        activeOpacity={0.8}
      />
    </Marker>
  );
};

export const DrawingPolylines = (props: { isDrawing: boolean }) => {
  const polylines = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].polylines
  );
  if (!polylines || polylines?.length === 0) {
    return null;
  }
  return polylines.map((polyline, index) => {
    return (
      <Polyline
        key={`Polyline-${index}`}
        coordinates={polyline.coordinates}
        strokeColor={polyline?.strokeColor || "black"}
        strokeWidth={DEFAULT_POLYLINE_STROKE_WIDTH}
      />
    );
  });
};
export const DrawingPoints = (props: { isDrawing: boolean }) => {
  const dispatch = useDispatch();
  const points = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].points
  );
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
  circle: {
    backgroundColor: "blue",
    width: 30,
    height: 30,
    borderRadius: 50,
    zIndex: 100,
  },
  infoText: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
