import React from "react";

import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, usePathname, Href } from "expo-router";
import { MapTabIcon, FieldTabIcon, SettingsTabIcon } from "./BottomButtons";
import { ScreenNames } from "../../../navigation/navigation";
import {
  HOME_MAP_SCREEN,
  HOME_SCOUT_REPORT_SCREEN,
  SETTINGS_SCREEN,
} from "../../../navigation/screens";
const FOCUSED_TAB_COLOR = "black";
const UNFOCUSED_TAB_COLOR = "gray";

type TAB = {
  component: React.FC<{ focused: boolean; color: string }>;
  path: ScreenNames[number];
  name: string;
};

const TABS: Array<TAB> = [
  {
    component: MapTabIcon,
    path: HOME_MAP_SCREEN,
    name: HOME_MAP_SCREEN.split("/")[1],
  },
  {
    component: FieldTabIcon,
    path: HOME_SCOUT_REPORT_SCREEN,
    name: HOME_SCOUT_REPORT_SCREEN.split("/")[1],
  },
  {
    component: SettingsTabIcon,
    path: SETTINGS_SCREEN,
    name: SETTINGS_SCREEN.split("/")[1],
  },
];

export const BottomBar = () => {
  const router = useRouter();
  const pathName = usePathname();
  // TODO: Is this safe??? maybe better to check this inside the onPress function
  const activeTab = pathName.split("/")[2];

  return (
    <View style={styles.container}>
      {TABS.map((Tab, index) => {
        const isFocused = activeTab === Tab.name;
        return (
          <TouchableOpacity
            style={styles.buttonContainer}
            key={index}
            onPress={() => {
              activeTab !== Tab.name && router.push(Tab.path as Href<string>);
            }}
          >
            <Tab.component
              key={index}
              focused={isFocused}
              color={isFocused ? FOCUSED_TAB_COLOR : UNFOCUSED_TAB_COLOR}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightgray",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
