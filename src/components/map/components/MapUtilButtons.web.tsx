import React from "react";
import { View, StyleSheet } from "react-native";
import type { MapRef } from "react-map-gl";
import UserLocationButton from "./UserLocationButton.web";
import FieldBoundsZoomButton from "./FieldBoundsZoomButton.web";
import { Field } from "../../../redux/fields/types";

interface Props {
  mapRef: React.RefObject<MapRef>;
  fields: Field[] | undefined;
}
export const MapUtilButtons = (props: Props) => {
  const { mapRef, fields } = props;
  return (
    <View style={styles.positioningContainer}>
      <View style={styles.buttonContainer}>
        <UserLocationButton mapRef={mapRef} />
        <FieldBoundsZoomButton mapRef={mapRef} fields={fields} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  positioningContainer: {
    position: "absolute",
    top: "8%",
    right: "7%",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    gap: 10,
  },
});
