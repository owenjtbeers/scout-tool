import React, { useEffect, useState } from "react";

import { ActivityIndicator, View } from "react-native";
// Navigation
import { useRouter, useRootNavigationState, Slot } from "expo-router";
import { LOGIN_SCREEN, HOME_MAP_SCREEN } from "../../navigation/screens";
import { colors } from "../../constants/styles";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useValidateMutation } from "../../redux/auth/authApi";

// Top level Component that will navigate to the correct screen
export default function App({ children }: { children: React.ReactNode }) {
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
        router.push(HOME_MAP_SCREEN);
      } else if ("error" in result) {
        setIsLoggedIn(false);
        router.push(LOGIN_SCREEN);
      }
    };
    if (!!rootNavigation?.key) {
      if (!!token) {
        // TODO: Offline support for auth
        validateToken();
      } else {
        setIsLoggedIn(false);
        router.push(LOGIN_SCREEN);
      }
    }
  }, [token, rootNavigation?.key]);

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Slot />;
}
