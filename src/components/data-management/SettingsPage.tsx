import React from "react";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

import { View, StyleSheet, FlatList } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import { baseApi } from "../../redux/baseApi";
import { clearState } from "../../redux/rootReducer";
import {
  LOGIN_SCREEN,
  SETTINGS_MANAGE_CROPS_SCREEN,
  SETTINGS_MANAGE_GROWERS_SCREEN,
  SETTINGS_MANAGE_ORGANIZATION_SCREEN,
  SETTINGS_MANAGE_PESTS_SCREEN,
} from "../../navigation/screens";
import { styles } from "./styles";

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

  const onManagePests = () => {
    router.navigate(SETTINGS_MANAGE_PESTS_SCREEN);
  };

  const manageButtons = [
    { title: "Manage Organization", onPress: onManageOrganization },
    { title: "Manage Growers", onPress: onManageGrowers },
    { title: "Manage Crops", onPress: onManageCrops },
    { title: "Manage Pests", onPress: onManagePests },
    // { title: "Logout", onPress: onLogout },
  ];

  const ManageButton = ({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) => (
    <Button onPress={onPress} raised radius={10}>
      {title}
    </Button>
  );
  return (
    <View style={settingsStyles.container}>
      {/* <View
        style={{
          display: "flex",
          flex: 1,
        }}
      > */}

      {/* </View> */}
      <FlatList
        numColumns={2}
        data={manageButtons}
        renderItem={({ item }) => <ManageButton {...item} />}
        contentContainerStyle={settingsStyles.flatList}
        columnWrapperStyle={{ justifyContent: "space-around", gap: 10 }}
      />
      <View style={settingsStyles.buttonsContainer}>
        {/* <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}> */}
        <Button
          raised
          radius={5}
          onPress={onLogout}
          title={"Logout"}
          // style={settingsStyles.container}
        ></Button>
      </View>
    </View>
  );
};

const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
  },
  flatList: {
    flex: 1,
    gap: 10,
    alignSelf: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
});
