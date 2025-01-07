import React from "react";
import { View, StyleSheet } from "react-native";
import type MapView from "react-native-maps";
import UserLocationButton from "../map/components/UserLocationButton";

interface Props {
  mapRef: React.RefObject<MapView>;
}
export const MapUtilButtons = (props: Props) => {
  const { mapRef } = props;
  return (
    <View style={styles.positioningContainer}>
      <View style={styles.buttonContainer}>
        <UserLocationButton mapRef={mapRef} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  positioningContainer: {
    position: "absolute",
    top: "16%",
    right: "7%",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    gap: 10,
  },
});
