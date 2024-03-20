import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MAP_DRAWING_REDUCER_KEY } from "../../redux/map/drawingSlice";

const DrawingInfoText = () => {
  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );

  return (
    <>
      {isDrawing && (
        <View style={styles.positioningContainer}>
          <Text>
            Drawing a Polygon{"\n"}
            1. Tap on the map to draw a point{"\n"}
            2. Tap a different point{"\n"}
            3. Tap the first point to close the polygon
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  positioningContainer: {
    position: "absolute",
    borderRadius: 5,
    padding: 5,
    // top: "16%",
    left: "1%",
    marginTop: 75,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    color: "black",
  },
});
export default DrawingInfoText;
