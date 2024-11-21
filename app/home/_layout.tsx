import React, { useEffect } from "react";

import { View, StyleSheet } from "react-native";
import { RootState } from "../../src/redux/store";

import { Slot } from "expo-router";
import { TopBar } from "../../src/components/layout/topBar/TopBar";
import { BottomBar } from "../../src/components/layout/bottomBar/HomeBottomBar";
import { Welcome } from "../../src/components/tutorial/Welcome"
import { useSelector } from "react-redux";

export default function HomeLayout() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  console.log(currentUser)
  if (!currentUser?.Organization?.hasSetupGrower && currentUser?.AccountType === "org_admin") {
    return <Welcome />
  }
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
