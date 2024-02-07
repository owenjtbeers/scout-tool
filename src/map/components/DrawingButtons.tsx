import React from "react";

// Components
import { View, TouchableOpacity, Text } from "react-native";
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
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={toggleIsDrawing}
        style={{ flex: 1, alignItems: "center" }}
      >
        <Ionicons name="pencil" size={24} color="black" />
        <Text>Draw</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={clearPolygon}
        style={{ flex: 1, alignItems: "center" }}
      >
        <Entypo name="eraser" size={24} color="black" />
        <Text>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};
