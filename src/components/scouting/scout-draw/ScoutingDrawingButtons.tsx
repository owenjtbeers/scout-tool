import React from "react";
import { Alert } from "react-native";
// Components
import { View, StyleSheet } from "react-native";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import { Button, useTheme } from "@rneui/themed";

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
};
export const ScoutingDrawingButtons = (props: DrawingButtonsProps) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const drawMode = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].drawMode
  );
  const selectedColor = (drawType: DrawMode) =>
    drawMode === drawType ? "black" : theme.colors.secondary;

  return (
    <View style={styles.drawingButtonsContainer}>
      <Button
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
      />
      <Button
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
      />
      <Button
        title={"Clear Shape"}
        onPress={() => {
          dispatch(drawingSlice.actions.clearAllShapes());
        }}
        icon={<Entypo name="eraser" size={24} color={theme.colors.secondary} />}
      />
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
    // backgroundColor: "white"
    alignItems: "center",
    borderRadius: 5,
    justifyContent: "space-around",
  },
});
