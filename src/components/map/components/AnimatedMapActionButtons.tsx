import React, { useState } from "react";

import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@rneui/themed";
import { SpeedDial } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { colors } from "../../../constants/styles";
import { ScreenNames } from "../../../navigation/navigation";
import { MAP_DRAW_SCREEN } from "../../../navigation/screens";
import { drawingSlice } from "../../../redux/map/drawingSlice";

const BUTTON_HEIGHT = 60;
const BUTTON_WIDTH = 60;

const AnimatedMapActionButtons = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { theme } = useTheme();
  const [animation] = useState(new Animated.Value(0));
  const dispatch = useDispatch();
  const router = useRouter();

  // const handleAddButtonPress = () => {
  //   setIsExpanded(!isExpanded);
  //   Animated.spring(animation, {
  //     toValue: isExpanded ? 0 : 1,
  //     friction: 5,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // const addButtonStyle = {
  //   transform: [
  //     {
  //       scale: animation.interpolate({
  //         inputRange: [0, 1],
  //         outputRange: [1, 0.95],
  //       }),
  //     },
  //     {
  //       rotate: animation.interpolate({
  //         inputRange: [0, 1],
  //         outputRange: ["0deg", "135deg"],
  //       }),
  //     },
  //   ],
  // };

  // const expandedButtonStyle = {
  //   opacity: animation,
  //   transform: [
  //     {
  //       translateY: animation.interpolate({
  //         inputRange: [0, 1],
  //         outputRange: [0, -100],
  //       }),
  //     },
  //   ],
  // };

  return (
    <SpeedDial
      isOpen={isExpanded}
      onOpen={() => setIsExpanded(true)}
      onClose={() => setIsExpanded(false)}
      icon={{ name: "add", size: 24 }}
      openIcon={{ name: "close", size: 24 }}
      labelPressable
      transitionDuration={100}
    >
      <SpeedDial.Action
        iconContainerStyle={styles.buttonPadding2}
        title="Add New Scouting Report"
        onPress={() => {}}
        icon={<AntDesign name="addfile" size={24} />}
      ></SpeedDial.Action>
      <SpeedDial.Action
        title="Add New Field"
        onPress={() => {
          dispatch(drawingSlice.actions.clearPolygon());
          dispatch(drawingSlice.actions.clearTempGeoJSON());
          dispatch(drawingSlice.actions.setOperation("add-field"));
          router.push(MAP_DRAW_SCREEN as Href<string>);
        }}
      >
        <FontAwesome5 name="draw-polygon" size={24} />
      </SpeedDial.Action>
    </SpeedDial>
  );
  // return (
  //   <View>
  //     <View style={styles.absolutePositioning}>
  //       <Animated.View
  //         style={[
  //           styles.textIconContainer,
  //           styles.buttonPadding,
  //           expandedButtonStyle,
  //         ]}
  //       >
  //         <Text style={styles.text}>Add New Scouting Report</Text>
  //         <TouchableOpacity style={styles.circle} activeOpacity={0.5}>
  //           <AntDesign name="addfile" size={24} color="black" />
  //         </TouchableOpacity>
  //       </Animated.View>
  //       <Animated.View
  //         style={[
  //           styles.textIconContainer,
  //           styles.buttonPadding,
  //           expandedButtonStyle,
  //         ]}
  //       >
  //         <Text style={styles.text}>Add New Field</Text>
  //         <TouchableOpacity
  //           style={styles.circle}
  //           activeOpacity={0.5}
  //           onPress={() => {
  //             dispatch(drawingSlice.actions.clearPolygon());
  //             dispatch(drawingSlice.actions.clearTempGeoJSON());
  //             dispatch(drawingSlice.actions.setOperation("add-field"));
  //             router.push("map-draw" as Href<ScreenNames[number]>);
  //           }}
  //         >
  //           <FontAwesome5 name="draw-polygon" size={24} color="black" />
  //         </TouchableOpacity>
  //       </Animated.View>
  //     </View>
  //     <Animated.View style={[styles.absolutePositioning]}>
  //       <TouchableOpacity
  //         onPress={handleAddButtonPress}
  //         style={[styles.circle, addButtonStyle]}
  //         activeOpacity={0.5}
  //       >
  //         <Ionicons name="add-sharp" size={24} color="black" />
  //       </TouchableOpacity>
  //     </Animated.View>
  //   </View>
  // );
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
