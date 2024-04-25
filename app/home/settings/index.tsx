import React from "react";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

import { View, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { userSlice } from "../../../src/redux/user/userSlice";
import { baseApi } from "../../../src/redux/baseApi";

export default () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onLogout = () => {
    // Clear user state
    dispatch(userSlice.actions.logout());
    // Clear api state, so that all data is refetched when user logs back in
    dispatch(baseApi.util.resetApiState());
    // Take user to login screen
    router.replace("/login");
  };
  return (
    <>
      <View style={styles.container}>
        <Button onPress={onLogout}>Logout</Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
  },
});
