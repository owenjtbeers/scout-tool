import React from "react";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

import { View, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { userSlice } from "../../../src/redux/user/userSlice";
import { baseApi } from "../../../src/redux/baseApi";
import { clearState } from "../../../src/redux/rootReducer";
import {
  LOGIN_SCREEN,
  SETTINGS_MANAGE_CROPS_SCREEN,
  SETTINGS_MANAGE_GROWERS_SCREEN,
  SETTINGS_MANAGE_ORGANIZATION_SCREEN,
} from "../../../src/navigation/screens";

export default () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onLogout = () => {
    // Clear all state
    clearState(dispatch);

    // Clear api state, so that all data is refetched when user logs back in
    dispatch(baseApi.util.resetApiState());
    // Take user to login screen
    router.replace(LOGIN_SCREEN);
  };

  const onManageGrowers = () => {
    router.push(SETTINGS_MANAGE_GROWERS_SCREEN);
  };

  const onManageOrganization = () => {
    router.push(SETTINGS_MANAGE_ORGANIZATION_SCREEN);
  };

  const onManageCrops = () => {
    router.navigate(SETTINGS_MANAGE_CROPS_SCREEN);
  };

  return (
    <>
      <View style={styles.container}>
        <Button onPress={onLogout}>Logout</Button>
        <Button onPress={onManageGrowers}>Manage Growers</Button>
        <Button onPress={onManageOrganization}>Manage Organization</Button>
        <Button onPress={onManageCrops}>Manage Crops</Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "lightgray",
  },
});
