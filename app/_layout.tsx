import React from "react";

import { View, StyleSheet } from "react-native";
import { Stack, Tabs } from "expo-router";

// Custom Components
import { TopBar } from "../src/components/layout/topBar/TopBar";
import { BottomBar } from "../src/components/layout/bottomBar/BottomBar";
import { MapScreen } from "../src/components/map/Map";
import { FieldTabIcon, MapTabIcon } from "../src/components/layout/bottomBar/BottomButtons";
// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/redux/store";

export default function AppLayout() {
  return (
    <Provider store={store}>
      {/* TODO: loading component should be defined */}
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          <TopBar />
          <Tabs>
            <Tabs.Screen
              name="index"
              options={{
                title: "Map",
                headerShown: false,
                tabBarIcon: MapTabIcon
              }}
            />
            <Tabs.Screen
              name="home"
              options={{
                title: "TODO",
                headerShown: false,
                tabBarIcon: FieldTabIcon
              }}
            />
          </Tabs>
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
    fontFamily: "Roboto",
  },
});
