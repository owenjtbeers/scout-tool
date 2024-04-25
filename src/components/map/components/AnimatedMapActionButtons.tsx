import React, { useEffect, useState } from "react";

import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { SpeedDial } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { colors } from "../../../constants/styles";
import {
  MAP_DRAW_SCREEN,
  SCOUT_CREATE_REPORT_SCREEN,
} from "../../../navigation/screens";
import { drawingSlice } from "../../../redux/map/drawingSlice";
import { RootState } from "../../../redux/store";
import {
  GLOBAL_SELECTIONS_REDUCER_KEY,
  globalSelectionsSlice,
} from "../../../redux/globalSelections/globalSelectionsSlice";
import { useSelector } from "react-redux";

const BUTTON_HEIGHT = 60;
const BUTTON_WIDTH = 60;

const AnimatedMapActionButtons = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  // const [animation] = useState(new Animated.Value(0));
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const selectedField = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].field
  );
  useEffect(() => {
    if (selectedField !== null) {
      setIsExpanded(false);
    }
  }, [selectedField]);

  return (
    <SpeedDial
      isOpen={isExpanded}
      onOpen={() => setIsExpanded(true)}
      onClose={() => {
        setIsExpanded(false);
      }}
      icon={{ name: "add", size: 24 }}
      openIcon={{ name: "close", size: 24 }}
      labelPressable
      transitionDuration={100}
      placement="right"
    >
      <SpeedDial.Action
        iconContainerStyle={styles.buttonPadding2}
        title="Add New Field"
        onPress={() => {
          dispatch(drawingSlice.actions.clearPolygons());
          dispatch(drawingSlice.actions.clearTempGeoJSON());
          dispatch(drawingSlice.actions.setOperation("add-field"));
          router.push(MAP_DRAW_SCREEN as Href<string>);
        }}
        icon={<FontAwesome5 name="draw-polygon" size={24} />}
      />
      <SpeedDial.Action
        iconContainerStyle={styles.buttonPadding2}
        title="Add New Scouting Report"
        onPress={() => {}}
        icon={<AntDesign name="addfile" size={24} />}
      />
    </SpeedDial>
  );
};

export const SelectedFieldSpeedDial = () => {
  const selectedField = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].field
  );
  if (selectedField === null) {
    return null;
  }
  return <SelectedFieldSpeedDialContents />;
};
const SelectedFieldSpeedDialContents = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  return (
    <SpeedDial
      isOpen={isExpanded}
      onOpen={() => setIsExpanded(true)}
      onClose={() => {
        dispatch(globalSelectionsSlice.actions.setField(null));
      }}
      icon={{ name: "add", size: 24 }}
      openIcon={{ name: "close", size: 24 }}
      labelPressable
      transitionDuration={100}
      placement={"left"}
    >
      <SpeedDial.Action
        iconContainerStyle={styles.buttonPadding2}
        title="Add New Scouting Report For Single Field"
        onPress={() => {
          router.push(SCOUT_CREATE_REPORT_SCREEN as Href<string>);
        }}
        icon={<AntDesign name="addfile" size={24} />}
      />
      <SpeedDial.Action
        iconContainerStyle={styles.buttonPadding2}
        title="Edit Crop History"
        onPress={() => {}}
        icon={<AntDesign name="edit" size={24} />}
      />
    </SpeedDial>
  );
};
const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.primary,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    // bottom: 40,
    // right: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
    // bottom: 40
  },
  textIconContainer: {
    marginLeft: "auto",
    alignItems: "center",
    flexDirection: "row",
  },
  absolutePositioning: {
    position: "absolute",
    bottom: 50,
    right: 50,
  },
  buttonPadding: {
    paddingTop: 20,
  },
  buttonPadding2: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
export default AnimatedMapActionButtons;
