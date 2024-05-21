import React from "react";
import { SafeAreaView } from "react-native";
import { en, registerTranslation } from "react-native-paper-dates";
// Navigation
import { Slot } from "expo-router";

// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/redux/store";

// Styles
import { ThemeProvider } from "@rneui/themed";
import { theme } from "../src/constants/styles";

registerTranslation("en", en);
const App = () => {
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
};

export default App;
