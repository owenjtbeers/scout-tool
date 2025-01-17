import React from "react";

// Components
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome5, Entypo, AntDesign } from "@expo/vector-icons";
import { Button, useTheme } from "@rneui/themed";

// Data
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import {
  MAP_DRAWING_REDUCER_KEY,
  drawingSlice,
} from "../../redux/map/drawingSlice";

type DrawingButtonsProps = {
  setModalVisible: (val: boolean) => void;
};
export const DrawingButtons = (props: DrawingButtonsProps) => {
  const { theme } = useTheme();
  const { setModalVisible } = props;
  const dispatch = useAppDispatch();

  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );

  const clearTempGeoJSON = () => {
    dispatch(drawingSlice.actions.clearPolygons());
    dispatch(drawingSlice.actions.clearTempGeoJSON());
  };

  const toggleIsDrawing = () => {
    dispatch(
      drawingSlice.actions.setIsDrawing({
        isDrawing: !isDrawing,
        drawMode: isDrawing ? null : "polygon",
      })
    );
    // Do this to prevent a bad state, so we don't confuse the uploaded shapefile with the drawn polygon
    dispatch(drawingSlice.actions.clearTempGeoJSON());
  };

  const spawnFileUploadModal = () => {
    dispatch(
      drawingSlice.actions.setIsDrawing({ isDrawing: false, drawMode: null })
    );
    dispatch(drawingSlice.actions.setOperation("upload-shapefile"));
    setModalVisible(true);
  };

  const selectedColor = isDrawing ? "black" : theme.colors.secondary;

  return (
    <View style={styles.drawingButtonsContainer}>
      <Button
        onPress={toggleIsDrawing}
        title={"Draw Polygon"}
        icon={
          <FontAwesome5 name="draw-polygon" size={24} color={selectedColor} />
        }
        // color={"primary"}
        titleStyle={{ color: selectedColor }}
        type={isDrawing ? "outline" : "solid"}
      ></Button>
      <Button
        onPress={spawnFileUploadModal}
        icon={
          <AntDesign name="addfile" size={24} color={theme.colors.secondary} />
        }
        title={"Upload"}
      ></Button>
      <Button
        title={"Clear Shape"}
        onPress={clearTempGeoJSON}
        icon={<Entypo name="eraser" size={24} color={theme.colors.secondary} />}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  drawingButtonsContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 1000,
  },
  button: {
    height: 50,
    width: 50,
    // backgroundColor: "white"
    alignItems: "center",
    borderRadius: 5,
    justifyContent: "space-around",
  },
});
