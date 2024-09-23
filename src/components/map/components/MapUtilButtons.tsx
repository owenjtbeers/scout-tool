import React from "react";
import { View, StyleSheet } from "react-native";
import type MapView from "react-native-maps";
import UserLocationButton from "./UserLocationButton";
import FieldBoundsZoomButton from "./FieldBoundsZoomButton";
import { Field } from "../../../redux/fields/types";

interface Props {
  mapRef: React.RefObject<MapView>;
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
