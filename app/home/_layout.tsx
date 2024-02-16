import React from "react";

import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";
// Custom Components
// import {
//   MapTabIcon,
//   FieldTabIcon,
// } from "../../src/components/layout/bottomBar/BottomButtons";
import { TopBar } from "../../src/components/layout/topBar/TopBar";
import { BottomBar } from "../../src/components/layout/bottomBar/HomeBottomBar";

export default function HomeLayout() {
  return (
    <View style={styles.container}>
      <TopBar />
      <Slot />
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
    fontFamily: "Roboto",
  },
});
