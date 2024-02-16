import React from "react";
import { View, StyleSheet } from "react-native";
import { DrawableMapScreen } from "../../src/components/map-draw/DrawableMap";

export default function Page() {
  return <DrawableMapScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
