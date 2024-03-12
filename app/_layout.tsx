import React from "react";

// Navigation
import { Slot } from "expo-router";

// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/redux/store";
import { ThemeProvider } from "@rneui/themed";
import { theme } from "../src/constants/styles";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <Slot />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
