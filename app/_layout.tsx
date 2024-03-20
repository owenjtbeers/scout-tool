import React from "react";
import { SafeAreaView } from "react-native";

// Navigation
import { Slot } from "expo-router";

// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/redux/store";

// Styles
import { ThemeProvider } from "@rneui/themed";
import { theme } from "../src/constants/styles";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <SafeAreaView style={{ flex: 1 }}>
            <Slot />
          </SafeAreaView>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
