import React from "react";
import { Button, Icon } from "@rneui/base";
import { StyleSheet } from "react-native";
import MapView, { LatLng } from "react-native-maps";

import * as Location from "expo-location";

const UserLocationButton = (props: {
  mapRef: React.RefObject<MapView>;
  currentLocation: { latitude: number; longitude: number };
}) => {
  const [currentLocation, setCurrentLocation] = React.useState({} as LatLng);

  const onButtonPress = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords as LatLng);
      props.mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  };

  const locateIcon = () => (
    <Icon type="material-community" name="crosshairs-gps" size={25} />
  );

  return (
    <Button
      onPress={onButtonPress}
      icon={locateIcon()}
      buttonStyle={styles.buttonStyle}
      containerStyle={styles.containerStyle}
    />
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "white",
    borderRadius: 50,
  },
  containerStyle: {
    position: "absolute",
    top: "12%",
    right: "7%",
  },
});

export default UserLocationButton;
