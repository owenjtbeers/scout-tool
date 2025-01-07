import React from "react";

// Components
import { View, StyleSheet } from "react-native";
import { FontAwesome5, Entypo, AntDesign } from "@expo/vector-icons";
import { Button, useTheme } from "@rneui/themed";

// Data
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import {
  MAP_DRAWING_REDUCER_KEY,
  drawingSlice,
} from "../../redux/map/drawingSlice";
import { useControl, ControlPosition, MapRef, IControl } from "react-map-gl";
import MapboxDraw, {
  DrawCreateEvent,
} from "@mapbox/mapbox-gl-draw";
import { mapCoordinatesToLatLng } from "../../utils/latLngConversions";

type DrawingButtonsProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  setModalVisible: (val: boolean) => void;
  mapRef: React.RefObject<MapRef>;
  position?: ControlPosition;
  onCreate: (evt: { features: object[] }) => void;
  onUpdate: (evt: { features: object[]; action: string }) => void;
  onDelete: (evt: { features: object[] }) => void;
};
export const DrawingButtons = (props: DrawingButtonsProps) => {
  const { theme } = useTheme();
  const { setModalVisible, mapRef } = props;
  const drawingOnCreate = (evt: DrawCreateEvent) => {
    props.onCreate && props.onCreate(evt);
    dispatch(
      drawingSlice.actions.setIsDrawing({ drawMode: null, isDrawing: false })
    );
    dispatch(
      drawingSlice.actions.addPolygon({
        index: 0,
        polygonPoints: mapCoordinatesToLatLng(
          // @ts-expect-error TODO: Figure out this error
          evt.features[0].geometry.coordinates[0]
        ),
      })
    );
  };
  // @ts-expect-error TODO: Figure ou tthis error
  const control = useControl<MapboxDraw>(
    () => new MapboxDraw(props),
    ({ map }: { map: MapRef }) => {
      map.on("draw.create", drawingOnCreate);
      map.on("draw.update", props.onUpdate);
      map.on("draw.delete", props.onDelete);
    },
    ({ map }: { map: MapRef }) => {
      map.off("draw.create", drawingOnCreate);
      map.off("draw.update", props.onUpdate);
      map.off("draw.delete", props.onDelete);
    },
    {
      position: props.position,
    }
  );
  const dispatch = useAppDispatch();
  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );
  const clearTempGeoJSON = () => {
    control.deleteAll();
    dispatch(drawingSlice.actions.clearPolygons());
    dispatch(drawingSlice.actions.clearTempGeoJSON());
  };

  const toggleIsDrawing = () => {
    const newIsDrawing = !isDrawing;
    dispatch(
      drawingSlice.actions.setIsDrawing({
        isDrawing: newIsDrawing,
        drawMode: isDrawing ? null : "polygon",
      })
    );
    if (newIsDrawing) {
      control.changeMode(control.modes.DRAW_POLYGON);
    } else {
      control.changeMode(control.modes.SIMPLE_SELECT);
    }
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
    position: "absolute",
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
