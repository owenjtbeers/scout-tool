import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

// Custom Imports
import { MapScreen } from "./src/map/Map";

// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/redux/store";

// React
import React from "react";
import "expo-dev-client";

console.log(process.env);
export default function App() {
  return (
    <Provider store={store}>
      {/* TODO: loading component should be defined */}
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          {/* TOP BAR */}
          <MapScreen />
          {/* BOTTOM BAR */}
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
