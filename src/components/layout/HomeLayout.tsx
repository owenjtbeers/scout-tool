import React from "react";

import { View, StyleSheet } from "react-native";
import { RootState } from "../../redux/store";

import { Slot } from "expo-router";
import { TopBar } from "./topBar/TopBar";
import { BottomBar } from "./bottomBar/HomeBottomBar";
import { Welcome } from "../tutorial/Welcome";
import { useSelector } from "react-redux";
import { hasOrganizationFinishedTutorial } from "../../utils/tutorial";

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
