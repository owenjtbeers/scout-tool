import React from "react";
import { Text, StyleSheet } from "react-native";

export default function Page() {
  return <Text style={styles.container}>Home</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
  },
})
