import React, { useEffect, useState } from "react";

import { View, StyleSheet } from "react-native";
import { RootState } from "../../src/redux/store";

import { Slot } from "expo-router";
import { TopBar } from "../../src/components/layout/topBar/TopBar";
import { BottomBar } from "../../src/components/layout/bottomBar/HomeBottomBar";
import { Welcome } from "../../src/components/tutorial/Welcome";
import { useSelector } from "react-redux";
import { hasOrganizationFinishedTutorial } from "../../src/utils/tutorial";

export default function HomeLayout() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const hasDismissedWelcomeScreen = useSelector(
    (state: RootState) => state.user.hasDismissedWelcomeScreen
  );
  const hasOrganizationFinishedTutorialBool = hasOrganizationFinishedTutorial(
    currentUser?.Organization
  );
  const shouldRenderWelcomeScreen =
    !hasOrganizationFinishedTutorialBool && !hasDismissedWelcomeScreen;
  return (
    <>
      {shouldRenderWelcomeScreen ? <Welcome /> : null}
      <View style={styles.container}>
        <TopBar />
        <Slot />
        <BottomBar />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
    fontFamily: "Roboto",
  },
});
