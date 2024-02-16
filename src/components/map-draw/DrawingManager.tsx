import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Polygon, Circle, Marker } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import {
  MAP_DRAWING_REDUCER_KEY,
  drawingSlice,
} from "../../redux/map/drawingSlice";
import { RootState } from "../../redux/store";

export const DrawingManager = (props: { mapRef: React.RefObject<MapView> }) => {
  const dispatch = useDispatch();
  const { mapRef } = props;
  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );

  const polygon = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].polygon
  );
  
  // useEffect(() => {
  //   // Disable map pan
  //   if (isDrawing) {
  //     mapRef.current?.
  //   }
  // }, [isDrawing]);
  return polygon.length ? (
    <>
      {polygon.map((point, index) => {
        return (
          <Marker
            anchor={{ x: 0.5, y: 0.5 }}
            coordinate={point}
            draggable
            key={`MarkerPolygon-${index}`}
            tracksViewChanges={false}
            onDrag={(event) => {
              const newPolygon = [...polygon];
              newPolygon[index] = event.nativeEvent.coordinate;
              dispatch(drawingSlice.actions.setPolygon(newPolygon));
            }}
            onPress={() => {
              // Close polygon
              if (index === 0) {
                dispatch(drawingSlice.actions.addPointToPolygon(polygon[0]));
                dispatch(drawingSlice.actions.setIsDrawing(false));
              }
            }}
          >
            <TouchableOpacity style={index === 0 && isDrawing ? { ...styles.circle, backgroundColor: "orange"} : styles.circle} activeOpacity={0.8}/>
          </Marker>
        );
      })}
      <Polygon
        coordinates={polygon}
        fillColor="rgba(15, 10, 222, 0.5)"
        strokeColor="blue"
        strokeWidth={5}
        lineDashPattern={[7, 1]}
      />
    </>
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
  circle: {
    backgroundColor: "blue",
    width: 30,
    height: 30,
    borderRadius: 50,
    zIndex: 100,
  },
});
