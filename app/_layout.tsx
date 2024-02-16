import React from "react";

// Navigation
import { Slot } from "expo-router";

// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/redux/store";

export default function App() {
  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Slot />
        </PersistGate>
      </Provider>
  )
}
