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
import { useSelector } from "react-redux";
import { RootState } from "../src/redux/store";
import { useValidateMutation } from "../src/redux/auth/authApi";

// Top level Component that will navigate to the correct screen
export default function App() {
  const router = useRouter();
  const rootNavigation = useRootNavigationState();

  const [validate] = useValidateMutation();
  const token = useSelector((state: RootState) => state.user.token);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const result = await validate({});
      if ("data" in result) {
        setIsLoggedIn(true);
        router.push(HOME_MAP_SCREEN as Href<string>);
      } else if ("error" in result) {
        setIsLoggedIn(false);
        router.push(LOGIN_SCREEN as Href<string>);
      }
    };
    if (!!rootNavigation.key) {
      if (!!token) {
        // TODO: Offline support for auth
        validateToken();
      } else {
        setIsLoggedIn(false);
        router.push(LOGIN_SCREEN as Href<string>);
      }
    }
  }, [token, rootNavigation.key]);

  // TODO: loading component should be defined, this should never really render based on the useEffect above
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
