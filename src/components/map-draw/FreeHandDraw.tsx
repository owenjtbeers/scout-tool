import React, { useEffect, useState, useRef, useMemo } from "react";
import { View, PanResponder, StyleSheet } from "react-native";
import Svg, { Path, Polyline } from "react-native-svg";
import { useDispatch } from "react-redux";
import { drawingSlice } from "../../redux/map/drawingSlice";
import MapView, { LatLng } from "react-native-maps";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { MAP_DRAWING_REDUCER_KEY } from "../../redux/map/drawingSlice";
import { DEFAULT_POLYLINE_STROKE_WIDTH } from "../../constants/constants";

interface FreehandDrawingProps {
  mapRef: React.RefObject<MapView>;
  // onFinishPolyline: (polyline: LatLng[]) => void;
}
const FreehandDrawing = (props: FreehandDrawingProps) => {
  const { mapRef } = props;

  const drawColor = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].drawColor
  );

  const pathRef = useRef<{ x: number; y: number }[]>([]);
  const [pathLength, setPathLength] = useState(0);
  const dispatch = useDispatch();
  let points = [] as [number, number][];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,

    onPanResponderMove: (e, gestureState) => {
      setPathLength(
        // Not sure if this is the best way to trigger an update, but it works
        pathRef.current.push({
          x: e.nativeEvent.locationX,
          y: e.nativeEvent.locationY,
        })
      );
    },
    onPanResponderGrant: () => {
      pathRef.current = [];
    },
    onPanResponderRelease: async () => {
      // Take the local state and make it permanent in redux
      // Add to the polylines array in the redux store

      // convert polyline to LatLng[]
      // Use a regex to find all the coordinates in the pathData string
      if (mapRef.current !== null) {
        const convertedPolyline = await Promise.all(
          pathRef.current.map(async (point) => {
            if (mapRef.current === null) {
              return { latitude: 0, longitude: 0 } as LatLng;
            }
            const { latitude, longitude } =
              await mapRef.current.coordinateForPoint(point);
            return { latitude, longitude } as LatLng;
          })
        );
        dispatch(
          drawingSlice.actions.addPolyline({
            coordinates: convertedPolyline,
            strokeColor: drawColor,
          })
        );
        // Clear the path
        pathRef.current = [];
        setPathLength(0);
      }
    },
  });

  const path = useMemo(
    () => pathRef.current?.map((item) => `${item.x},${item.y}`).join(" "),
    [pathLength]
  );
  return (
    <View {...panResponder.panHandlers} style={styles.gestureResponder}>
      {pathRef.current !== null && (
        <Svg height={"100%"} width={"100%"}>
          <Polyline
            points={path}
            stroke={drawColor}
            strokeWidth={DEFAULT_POLYLINE_STROKE_WIDTH}
            fill={"none"}
          />
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gestureResponder: {
    backgroundColor: "transparent",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
});
export default FreehandDrawing;
