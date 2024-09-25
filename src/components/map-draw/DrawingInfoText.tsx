import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MAP_DRAWING_REDUCER_KEY } from "../../redux/map/drawingSlice";
import { Ionicons } from "@expo/vector-icons";

const DrawingInfoText = () => {
  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );
  const drawMode = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].drawMode
  );
  if (isDrawing && drawMode === "polygon") {
    return (
      <View style={styles.positioningContainer}>
        <DrawPolygonText />
      </View>
    );
  } else if (isDrawing && drawMode === "polyline") {
    return (
      <View style={styles.positioningContainer}>
        <DrawPolylineText />
      </View>
    );
  }

  return (
    <>
      {isDrawing && (
        <View style={styles.positioningContainer}>
          <DropPointText />
        </View>
      )}
    </>
  );
};

const DrawPolygonText = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  if (isCollapsed) {
    return (
      <TouchableOpacity
        style={styles.positioningContainer}
        onPress={() => setIsCollapsed(false)}
      >
        <Text>Stuck? Need Info?</Text>
        <Ionicons
          name="information-circle"
          size={24}
          color="black"
          style={{ margin: "auto" }}
        />
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.positioningContainer}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text>Drawing a Polygon</Text>
        <TouchableOpacity onPress={() => setIsCollapsed(true)}>
          <Ionicons name="close-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text>
        1. Tap on the map to draw a point{"\n"}
        2. Tap a different point{"\n"}
        2a. Tap and hold a point to move it
      </Text>
      <Text
        style={{ fontWeight: "bold", fontSize: 24, flex: 1, flexWrap: "wrap" }}
      >
        3. Tap the first point to close the polygon or exit polygon drawing
        mode.
      </Text>
      <Text>4. Then submit field by pressing the button at the bottom</Text>
    </View>
  );
};

const DrawPolylineText = () => {
  return (
    <View style={styles.positioningContainer}>
      <Text>Draw a line by tapping on the map</Text>
      <Text>Exit by tapping the Draw Button</Text>
    </View>
  );
};

const DropPointText = () => {
  return (
    <View style={styles.positioningContainer}>
      <Text>Hold and drag a pin to move it</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  positioningContainer: {
    position: "absolute",
    borderRadius: 5,
    padding: 5,
    // top: "16%",
    left: "1%",
    marginTop: 55,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    color: "black",
  },
});
export default DrawingInfoText;
