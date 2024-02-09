import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../../../styles";

const BUTTON_HEIGHT = 60;
const BUTTON_WIDTH = 60;

const AnimatedMapActionButtons = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [animation] = useState(new Animated.Value(0));

  const handleAddButtonPress = () => {
    setIsExpanded(!isExpanded);
    Animated.spring(animation, {
      toValue: isExpanded ? 0 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const addButtonStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.95],
        }),
      },
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "135deg"],
        }),
      },
    ],
  };

  const expandedButtonStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        }),
      },
    ],
  };

  return (
    <View>
      <View style={styles.absolutePositioning}>
        <Animated.View
          style={[
            styles.textIconContainer,
            styles.buttonPadding,
            expandedButtonStyle,
          ]}
        >
          <Text style={styles.text}>Add New Scouting Report</Text>
          <TouchableOpacity style={styles.circle} activeOpacity={0.5}>
            <AntDesign name="addfile" size={24} color="black" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            styles.textIconContainer,
            styles.buttonPadding,
            expandedButtonStyle,
          ]}
        >
          <Text style={styles.text}>Add New Field</Text>
          <TouchableOpacity style={styles.circle} activeOpacity={0.5}>
            <FontAwesome5 name="draw-polygon" size={24} color="black" />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Animated.View style={[styles.absolutePositioning]}>
        <TouchableOpacity
          onPress={handleAddButtonPress}
          style={[styles.circle, addButtonStyle]}
          activeOpacity={0.5}
        >
          <Ionicons name="add-sharp" size={24} color="black" />
        </TouchableOpacity>
      </Animated.View>
    </View>
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
});
export default AnimatedMapActionButtons;
