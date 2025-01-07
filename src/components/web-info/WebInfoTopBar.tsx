import React from "react";
import { Header, Text, useTheme, Button, Tab } from "@rneui/themed";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { useRouter, usePathname } from "expo-router";
import {
  INFO_PRICING_SCREEN,
  INFO_PRODUCTS_SCREEN,
  LOGIN_SCREEN,
  SIGNUP_SCREEN,
  INFO_CONTACT_SCREEN,
  INFO_ABOUT_SCREEN,
  INFO_LANDING_SCREEN,
} from "../../navigation/screens";

const TABS = [
  {
    title: "Products",
    screen: INFO_PRODUCTS_SCREEN,
  },
  {
    title: "Pricing",
    screen: INFO_PRICING_SCREEN,
  },
  {
    title: "Contact",
    screen: INFO_CONTACT_SCREEN,
  },
  {
    title: "About",
    screen: INFO_ABOUT_SCREEN,
  },
];
const WebInfoTopBar = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [tabIndex, setTabIndex] = React.useState(0);
  return (
    <Header
      backgroundColor={theme.colors.primary}
      ViewComponent={View}
      leftComponent={{
        text: "Grounded Agri-Tools",
        style: {
          color: theme.colors.secondary,
          fontSize: 20,
          flex: 1,
          overflow: "visible",
          textAlign: "center",
        },
        onPress: () => router.push(INFO_LANDING_SCREEN),
      }}
      centerComponent={
        <View style={styles.navigationContainer}>
          <Tab
            value={tabIndex}
            onChange={(index) => {
              setTabIndex(index);
              router.push(TABS[index].screen);
            }}
            disableIndicator={pathname === INFO_LANDING_SCREEN}
            indicatorStyle={{
              backgroundColor: theme.colors.secondary,
              height: 3,
            }}
          >
            {TABS.map((tab) => (
              <Tab.Item title={tab.title} key={tab.title} />
            ))}
          </Tab>
        </View>
      }
      rightComponent={
        <View style={{ display: "flex", flex: 1, gap: 10 }}>
          <Button
            radius={10}
            title={"Signup"}
            color="secondary"
            titleStyle={{ color: theme.colors.primary }}
            onPress={() => router.push(SIGNUP_SCREEN)}
          ></Button>
          <Button
            radius={10}
            title={"Login"}
            color="secondary"
            titleStyle={{ color: theme.colors.primary }}
            onPress={() => router.push(LOGIN_SCREEN)}
            // type={"outline"}
          ></Button>
        </View>
      }
      containerStyle={{
        justifyContent: "space-around",
      }}
    />
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  navigationButton: {},
});
export default WebInfoTopBar;
