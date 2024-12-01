import React from "react";

import { StyleSheet, Text } from "react-native";
import { useRouter, usePathname } from "expo-router";
import {
  MapTabIcon,
  FieldTabIcon,
  SettingsTabIcon,
  FeedbackTabIcon,
} from "./BottomButtons";
import { Tab } from "@rneui/themed";
import { ScreenNames } from "../../../navigation/navigation";
import { colors } from "../../../constants/styles";
import {
  HOME_MAP_SCREEN,
  HOME_SCOUT_REPORT_SCREEN,
  HOME_SETTINGS_SCREEN,
  HOME_FEEDBACK_SCREEN,
} from "../../../navigation/screens";
const FOCUSED_TAB_COLOR = colors.secondary;
const UNFOCUSED_TAB_COLOR = "gray";

type TAB = {
  component: React.FC<{ focused: boolean; color: string }>;
  path: string; // ScreenNames[number];
  name: string;
};

const TABS: Array<TAB> = [
  {
    component: MapTabIcon,
    path: HOME_MAP_SCREEN,
    name: HOME_MAP_SCREEN.split("/").pop() as string,
  },
  {
    component: FieldTabIcon,
    path: HOME_SCOUT_REPORT_SCREEN,
    name: HOME_SCOUT_REPORT_SCREEN.split("/").pop() as string,
  },
  {
    component: SettingsTabIcon,
    path: HOME_SETTINGS_SCREEN,
    name: HOME_SETTINGS_SCREEN.split("/").pop() as string,
  },
  {
    component: FeedbackTabIcon,
    path: HOME_FEEDBACK_SCREEN,
    name: HOME_FEEDBACK_SCREEN.split("/").pop() as string,
  },
];

export const BottomBar = () => {
  const router = useRouter();
  const pathName = usePathname();

  const [tabIndex, setTabIndex] = React.useState(0);

  const getActiveTab = () => {
    return pathName.split("/").pop();
  };
  const onTabPress = (tabIndex: number) => {
    const activeTab = getActiveTab();
    const tab = TABS[tabIndex];
    activeTab !== tab.name && router.push(tab.path);
    setTabIndex(tabIndex);
  };
  return (
    <Tab style={styles.container} value={tabIndex} onChange={onTabPress}>
      {TABS.map((TabInfo, index) => {
        const activeTab = getActiveTab();
        const isFocused = activeTab === TabInfo.name;
        const focusedColor = isFocused
          ? FOCUSED_TAB_COLOR
          : UNFOCUSED_TAB_COLOR;
        return (
          <Tab.Item
            style={styles.buttonContainer}
            key={`Tab${index}`}
            title={TabInfo.name}
            // onPress={() => {
            //   activeTab !== TabInfo.name &&
            //     router.push(TabInfo.path as Href<string>);
            // }}
          >
            <TabInfo.component
              key={`Tab${index}-Icon-BottomBar`}
              focused={isFocused}
              color={focusedColor}
            />
            <Text numberOfLines={1} style={{ color: focusedColor }}>
              {TabInfo.name.toUpperCase()}
            </Text>
          </Tab.Item>
        );
      })}
    </Tab>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-around",
    height: 60,
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
