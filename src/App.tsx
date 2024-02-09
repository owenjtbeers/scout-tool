import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

// Custom Imports
import { MapScreen } from "./components/map/Map";
import { TopBar } from "./components/layout/topBar/TopBar";
import { BottomBar } from "./components/layout/bottomBar/BottomBar";

// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

// React
import React from "react";
import "expo-dev-client";

export default function App() {
  return (
    <Provider store={store}>
      {/* TODO: loading component should be defined */}
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          <TopBar />
          <BottomBar />
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
  },
});
