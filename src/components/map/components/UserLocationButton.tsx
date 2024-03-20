import React from "react";
import { Button } from "@rneui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import MapView, { LatLng } from "react-native-maps";

import * as Location from "expo-location";
import { defaultRegion } from "../../../constants/constants";

const UserLocationButton = (props: { mapRef: React.RefObject<MapView> }) => {
  const onButtonPress = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      // setCurrentLocation(location.coords as LatLng);
      props.mapRef.current?.animateToRegion({
        ...defaultRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
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
