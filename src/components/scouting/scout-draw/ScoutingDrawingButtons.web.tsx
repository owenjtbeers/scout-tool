import React from "react";
// Components
import { View, StyleSheet } from "react-native";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import { Button, useTheme, Text, Tooltip } from "@rneui/themed";

// Expo
import * as Location from "expo-location";

// Data
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  MAP_DRAWING_REDUCER_KEY,
  drawingSlice,
  DrawMode,
} from "../../../redux/map/drawingSlice";
import MapView from "react-native-maps";
import { DrawingColorButtons } from "./DrawingColorButtons";
import { PointOfInterestButtons } from "./PointOfInterestButtons";
import { scoutDrawStyles } from "./styles";
import { UseFormGetValues } from "react-hook-form";
import { ScoutingReportForm } from "../types";

type DrawingButtonsProps = {
  mapRef: React.RefObject<MapView>;
  onDrawPress: (isDrawing: boolean, drawMode: DrawMode) => void;
  onAddPestPointPress: (isDrawing: boolean, drawMode: DrawMode) => void;
  getFormValues: UseFormGetValues<ScoutingReportForm>;
};
export const ScoutingDrawingButtons = (props: DrawingButtonsProps) => {
  const { onDrawPress, onAddPestPointPress } = props;
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const drawMode = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].drawMode
  );
  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );

  const drawColor = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].drawColor
  );

  const selectedColor = (drawType: DrawMode) =>
    drawMode === drawType ? "black" : theme.colors.secondary;

  return (
    <View style={scoutDrawStyles.buttonsContainer} pointerEvents="box-none">
      <View style={scoutDrawStyles.drawingButtonsContainer}>
        <Tooltip popover={<Text>Disabled on web</Text>} withPointer>
          <Button
            title={"Add Pest Point"}
            onPress={async () => {
              const newDrawingMode =
                drawMode === "pest-point" ? null : "pest-point";
              const newIsDrawing = drawMode === "pest-point" ? false : true;
              onAddPestPointPress &&
                onAddPestPointPress(newIsDrawing, newDrawingMode);
              // Might be exiting drawing mode into pest point mode directly, for state operations
              onDrawPress && onDrawPress(newIsDrawing, newDrawingMode);
              dispatch(
                drawingSlice.actions.setIsDrawing({
                  drawMode: newDrawingMode,
                  isDrawing: newIsDrawing,
                })
              );
            }}
            icon={
              <FontAwesome5
                name="exclamation-circle"
                size={24}
                color={selectedColor("pest-point")}
              />
            }
            titleStyle={{ color: selectedColor("pest-point") }}
            type={drawMode === "pest-point" ? "outline" : "solid"}
            containerStyle={{ marginHorizontal: 5 }}
            disabled={true}
          />
        </Tooltip>
        <Tooltip
          containerStyle={{ width: 60, height: 100 }}
          popover={<Text>Disabled on web</Text>}
          toggleOnPress={true}
        >
          <span>
            <Button
              title={"Draw"}
              icon={{
                name: "edit",
                size: 24,
                color: selectedColor("polyline"),
              }}
              onPress={() => {
                const newDrawingMode =
                  drawMode === "polyline" ? null : "polyline";
                const newIsDrawing = drawMode === "polyline" ? false : true;
                onDrawPress(newIsDrawing, newDrawingMode);
                // Might be exiting pest point mode into drawing mode directly, for state operations
                onAddPestPointPress &&
                  onAddPestPointPress(newIsDrawing, newDrawingMode);
                dispatch(
                  drawingSlice.actions.setIsDrawing({
                    drawMode: newDrawingMode,
                    isDrawing: newIsDrawing,
                  })
                );
              }}
              titleStyle={{ color: selectedColor("polyline") }}
              type={drawMode === "polyline" ? "outline" : "solid"}
              disabled={true}
            />
          </span>
        </Tooltip>
      </View>
      {isDrawing && drawMode === "polyline" && <DrawingColorButtons />}
      {isDrawing && drawMode === "pest-point" && (
        <PointOfInterestButtons getFormValues={props.getFormValues} />
      )}
    </View>
  );
};
