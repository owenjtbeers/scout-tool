import React from "react";
import { Button } from "@rneui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import MapView, { MapInstance, MapRef } from "react-map-gl";

import * as Location from "expo-location";
import { defaultRegion } from "../../../constants/constants";

const UserLocationButton = (props: { mapRef: React.RefObject<MapRef> }) => {
  const onButtonPress = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      // setCurrentLocation(location.coords as LatLng);
      props.mapRef.current?.flyTo({
        ...defaultRegion,
        center: [location.coords.longitude, location.coords.latitude],
        zoom: 15,
        duration: 1000,
      });
    })();
  };

  const locateIcon = () => (
    <MaterialCommunityIcons name="crosshairs-gps" size={25} />
  );

  return (
    <Button
      onPress={onButtonPress}
      icon={locateIcon()}
      buttonStyle={styles.buttonStyle}
      raised={false}
      color={"secondary"}
    />
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 50,
  },
});

export default UserLocationButton;
