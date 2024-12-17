import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { en, registerTranslation } from "react-native-paper-dates";
// Navigation
import { Slot } from "expo-router";

// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../../../src/redux/store";

// Styles
import { ThemeProvider } from "@rneui/themed";
import { theme } from "../../../src/constants/styles";


registerTranslation("en", en);
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <SafeAreaProvider style={{ flex: 1 }}>
              <Slot />
            </SafeAreaProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
