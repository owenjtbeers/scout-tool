import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Slot, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../../../src/redux/store";
import { colors } from "../../../src/constants/styles";
import { HOME_MAP_SCREEN } from "../../../src/navigation/screens";

const translationMap = {
  "add-field": "Create New Field",
  "edit-field": "Edit field: ",
  "upload-shapefile": "Upload Shapefile",
};

const Layout = () => {
  const router = useRouter();
  const onPressBack = () => {
    router.push(HOME_MAP_SCREEN);
  };

  const operation = useSelector(
    (state: RootState) => state["map-drawing"].operation
  );

  const translation = operation ? translationMap[operation] : "Drawing";

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <Text style={styles.text}>{translation}</Text>
        <Pressable style={styles.button} onPress={onPressBack}>
          <Ionicons name="close-sharp" size={24} color="white" />
        </Pressable>
      </View>
      <Slot />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    height: 100,
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: 20,
    paddingLeft: 20,
    color: "white",
  },
  button: {
    paddingRight: 20,
  },
});

export default Layout;
