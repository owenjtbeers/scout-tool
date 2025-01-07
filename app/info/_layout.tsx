import React from "react";
import { Slot } from "expo-router";
import { View } from "react-native";
import WebInfoTopBar from "../../src/components/web-info/WebInfoTopBar";

const WebInfoLayout: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <WebInfoTopBar />
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </View>
  );
};

export default WebInfoLayout;
