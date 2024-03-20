import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Polygon, Marker, Geojson } from "react-native-maps";
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
  const tempGeoJSON = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].tempGeoJSON
  );

  return polygon.length || tempGeoJSON !== null ? (
    <>
      {polygon?.length > 0 &&
        polygon.map((point, index) => {
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
              <TouchableOpacity
                style={
                  index === 0 && isDrawing
                    ? { ...styles.circle, backgroundColor: "orange" }
                    : styles.circle
                }
                activeOpacity={0.8}
              />
            </Marker>
          );
        })}
      {polygon.length > 0 && (
        <Polygon
          coordinates={polygon}
          fillColor={"#004e9d"}
          strokeColor="lightblue"
          strokeWidth={5}
          lineDashPattern={[7, 1]}
        />
      )}
      {tempGeoJSON !== null && (
        <Geojson
          key={"tempGeoJSON"}
          // @ts-ignore TODO: Figure out how to resolve this between the two libraries
          geojson={tempGeoJSON}
          strokeColor={"lightblue"}
          fillColor={"#004e9d"}
        />
      )}
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
  infoText: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
