import React, { useEffect, useState } from "react";

import { Text, ActivityIndicator, View } from "react-native";
// Navigation
import { useRouter, useRootNavigationState, Href } from "expo-router";
import {
  LOGIN_SCREEN,
  HOME_MAP_SCREEN,
  HOME_SCREEN,
} from "../src/navigation/screens";
import { ScoutToolStackNavigation } from "../src/navigation/navigation";
import { colors } from "../src/constants/styles";

// Top level Component that will navigate to the correct screen
export default function App() {
  const router = useRouter();
  const rootNavigation = useRootNavigationState();

  const [isLoggedIn] = useState(true);

  useEffect(() => {
    if (!!rootNavigation.key) {
      if (!isLoggedIn) {
        router.push(LOGIN_SCREEN as Href<string>);
      } else if (isLoggedIn) {
        console.log("Navigating to map screen");
        router.push(HOME_MAP_SCREEN as Href<string>);
      }
    }
  }, [rootNavigation.key]);

  // TODO: loading component should be defined, this should never really render based on the useEffect above
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
