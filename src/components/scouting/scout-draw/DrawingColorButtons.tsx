import React from "react";
import { View } from "react-native";
import { Button, useTheme } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import {
  MAP_DRAWING_REDUCER_KEY,
  drawingSlice,
} from "../../../redux/map/drawingSlice";
import { RootState } from "../../../redux/store";
import { scoutDrawStyles as styles } from "./styles";

export const DrawingColorButtons = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const drawColor = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].drawColor
  );
  return (
    <View style={styles.colorButtonsContainer}>
      <View style={{ flexDirection: "row" }}>
        <ColorButton color="white" isSelected={drawColor === "white"} />
        <ColorButton color="black" isSelected={drawColor === "black"} />
        <ColorButton color="red" isSelected={drawColor === "red"} />
        <ColorButton color="limegreen" isSelected={drawColor === "limegreen"} />
        <ColorButton color="blue" isSelected={drawColor === "blue"} />
      </View>
      <View style={{ paddingTop: 10 }}>
        <Button
          title={"Undo"}
          onPress={() => {
            dispatch(drawingSlice.actions.undoPolyline());
          }}
          radius={10}
          buttonStyle={styles.button}
          // containerStyle={{ padding: 5 }}
          // size={"lg"}
          icon={{ name: "undo", size: 24, color: theme.colors.secondary }}
        />
      </View>
    </View>
  );
};

const ColorButton = (props: { color: string; isSelected: boolean }) => {
  const { color, isSelected } = props;
  const dispatch = useDispatch();
  return (
    <Button
      onPress={() => {
        // Set the selected color to the color passed in
        dispatch(drawingSlice.actions.setDrawColor(color));
      }}
      radius={10}
      raised={isSelected}
      containerStyle={{ margin: 5 }}
      buttonStyle={{
        ...styles.colorButton,
        backgroundColor: color,
        borderColor: isSelected ? "grey" : "lightgrey",
        borderRadius: 10,
        borderWidth: 6,
      }}
    />
  );
};
