import React from "react";
// Components
import { View, StyleSheet } from "react-native";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import { Button, useTheme, Text } from "@rneui/themed";

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

type DrawingButtonsProps = {
  mapRef: React.RefObject<MapView>;
  onDrawPress: (isDrawing: boolean, drawMode: DrawMode) => void;
};
export const ScoutingDrawingButtons = (props: DrawingButtonsProps) => {
  const { onDrawPress } = props;
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
    <View style={styles.buttonsContainer} pointerEvents="box-none">
      <View style={styles.drawingButtonsContainer}>
        {/* <Button
          onPress={() => {
            dispatch(
              drawingSlice.actions.setDrawMode(
                drawMode !== "polygon" ? "polygon" : null
              )
            );
          }}
          title={"Draw Polygon"}
          icon={
            <FontAwesome5
              name="draw-polygon"
              size={24}
              color={selectedColor("polygon")}
            />
          }
          titleStyle={{ color: selectedColor("polygon") }}
          type={drawMode === "polygon" ? "outline" : "solid"}
        /> */}
        {/* <Button
          title={"Drop Point"}
          onPress={async () => {
            Alert.alert("Where to drop the point?", "", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Current Location",
                onPress: async () => {
                  let location = await Location.getLastKnownPositionAsync({});
                  if (location?.coords) {
                    const latLng = {
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    };
                    dispatch(drawingSlice.actions.addPoint(latLng));
                    // Zoom camera to location
                    const camera = await props.mapRef.current?.getCamera();
                    props.mapRef.current?.animateCamera({
                      ...camera,
                      center: latLng,
                    });
                  } else {
                    // Display an error message for the user
                    alert("Could not get location. Please try again.");
                  }
                },
              },
              {
                text: "Center of Screen",
                onPress: async () => {
                  // Drop at center of screen
                  const camera = await props.mapRef.current?.getCamera();
                  if (camera?.center) {
                    const latLng = {
                      latitude: camera.center.latitude,
                      longitude: camera.center.longitude,
                    };
                    dispatch(drawingSlice.actions.addPoint(latLng));
                    props.mapRef.current?.animateCamera({
                      ...camera,
                      center: latLng,
                    });
                  } else {
                    // Display an error message for the user
                    alert("Could not get location. Please try again.");
                  }
                },
              },
            ]);
          }}
          icon={
            <Entypo name="location" size={24} color={selectedColor("point")} />
          }
          titleStyle={{ color: selectedColor("point") }}
          type={drawMode === "point" ? "outline" : "solid"}
        /> */}
        <Button
          title={"Draw"}
          icon={{ name: "edit", size: 24, color: selectedColor("polyline") }}
          onPress={() => {
            onDrawPress(isDrawing, drawMode);
            dispatch(
              drawingSlice.actions.setIsDrawing({
                drawMode: drawMode === "polyline" ? null : "polyline",
                isDrawing: !isDrawing,
              })
            );
          }}
          titleStyle={{ color: selectedColor("polyline") }}
          type={drawMode === "polyline" ? "outline" : "solid"}
        />
        {/* <Button
          title={"Clear Shape"}
          onPress={() => {
            dispatch(drawingSlice.actions.clearAllShapes());
          }}
          icon={<Entypo name="eraser" size={24} color={theme.colors.secondary} />}
        /> */}
      </View>
      {isDrawing && drawMode === "polyline" && (
        <View style={styles.colorButtonsContainer}>
          <View style={{ flexDirection: "row" }}>
            <ColorButton color="white" isSelected={drawColor === "white"} />
            <ColorButton color="black" isSelected={drawColor === "black"} />
            <ColorButton color="red" isSelected={drawColor === "red"} />
            <ColorButton
              color="limegreen"
              isSelected={drawColor === "limegreen"}
            />
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
      )}
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

const styles = StyleSheet.create({
  buttonsContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 10,
  },
  drawingButtonsContainer: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "transparent",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    zIndex: 10,
    left: 0,
    right: 0,
    top: 0, // Set bottom to 0 to align at the bottom
    marginLeft: "auto",
    marginRight: "auto",
  },
  colorButtonsContainer: {
    // flexDirection: "row",
    height: 70,
    backgroundColor: "lightgray",
    flexWrap: "wrap",
    // justifyContent: "space-around",
    // alignItems: "center",
    position: "absolute",
    zIndex: 10,
    left: 0,
    right: 0,
    bottom: 0, // Set bottom to 0 to align at the bottom
    // marginLeft: "auto",
    // marginRight: "auto",
    padding: 5,
    borderRadius: 10,
  },
  colorButton: {
    height: 50,
    width: 50,
  },
  button: {
    alignItems: "center",
    borderRadius: 5,
    justifyContent: "space-around",
    padding: 5,
  },
});
