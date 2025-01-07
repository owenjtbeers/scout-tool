import React, { useState, useEffect, ReactNode } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";
import { FAB } from "@rneui/themed";

interface ScoutingSideSheetProps {
  children?: ReactNode;
  isDrawing?: boolean;
}

const MAX_SIDE_SHEET_WIDTH = 325;
export const ScoutingSideSheet = (props: ScoutingSideSheetProps) => {
  const [animation] = useState(new Animated.Value(0));
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);

  useEffect(() => {
    if (props.isDrawing) {
      setIsSideSheetOpen(false);
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else if (!isSideSheetOpen) {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [props.isDrawing]);

  const onHandlerStateChange = (event: any) => {
    setIsSideSheetOpen(!isSideSheetOpen);
    Animated.spring(animation, {
      toValue: isSideSheetOpen ? 1 : 0,
      useNativeDriver: true,
    }).start();
  };

  const windowWidth = Dimensions.get("window").width;
  return (
    <>
      <Animated.View
        style={{
          ...styles.sideSheet,
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, Math.max(-windowWidth * 0.8, -MAX_SIDE_SHEET_WIDTH)],
              }),
            },
          ],
        }}
      >
        <Animated.View
          style={[
            styles.floatingSideSheetCollapseButton,
            {
              transform: [
                {
                  translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0],
                    // outputRange: [0, Math.max(-windowWidth * 0.8, -500)],
                    extrapolate: "clamp",
                  }),
                },
                {
                  rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["180deg", "0deg"],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        >
          <FAB
            onPress={onHandlerStateChange}
            icon={{ name: "arrow-right", size: 24 }}
            visible={!props.isDrawing}
          />
        </Animated.View>
        {props.children}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  sideSheet: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "80%",
    maxWidth: MAX_SIDE_SHEET_WIDTH,
    backgroundColor: "white",
    zIndex: 30,
  },
  floatingSideSheetCollapseButton: {
    padding: 5,
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    position: "absolute",
    right: "-13%",
    top: "50%",
    zIndex: 100,
    // backgroundColor: "none",
  },
});
