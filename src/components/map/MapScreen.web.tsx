import React from "react";
import { View } from "react-native";
import { TopBar } from "../layout/topBar/TopBar";
import { MapContainer } from "./MapContainer";

/*
  This component is a container for the MapContainer component.
*/
export const MapScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <MapContainer />
    </View>
  );
};

export default MapScreen;
