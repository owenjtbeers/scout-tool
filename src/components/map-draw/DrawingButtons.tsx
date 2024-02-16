import React from "react";

// Components
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";

// Data
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import {
  MAP_DRAWING_REDUCER_KEY,
  drawingSlice,
} from "../../redux/map/drawingSlice";

export const DrawingButtons = () => {
  const dispatch = useAppDispatch();

  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );

  const clearPolygon = () => {
    dispatch(drawingSlice.actions.clearPolygon());
  };

  const toggleIsDrawing = () => {
    dispatch(drawingSlice.actions.setIsDrawing(!isDrawing));
  };

  return (
    <View style={styles.drawingButtonsContainer}>
      <TouchableOpacity
        onPress={toggleIsDrawing}
        style={{ ...styles.button, backgroundColor: isDrawing ? "lightblue" : "white" }}
      >
        <Ionicons name="pencil" size={24} color="black" />
        <Text>Draw</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={clearPolygon}
        style={styles.button}
      >
        <Entypo name="eraser" size={24} color="black" />
        <Text>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  drawingButtonsContainer: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "lightgray",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    height: 50,
    width: 50,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 5,
    justifyContent: "space-around",
  }
});