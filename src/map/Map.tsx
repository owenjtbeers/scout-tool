import React, { useCallback, useEffect } from "react";
import { View, Text, StyleSheet, PermissionsAndroid } from "react-native";
import MapView, {
  LatLng,
  MapPressEvent,
  PROVIDER_GOOGLE,
} from "react-native-maps";
// TODO Revisit this on another day
// import MapBoxGL from "@rnmapbox/maps"
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/store";
import * as Location from "expo-location";

// Components
import { MapContentManager } from "./MapContentManager";
import { DrawingButtons } from "./components/DrawingButtons";
import UserLocationButton from "./components/UserLocationButton";

// Data
import { RootState } from "../redux/store";

// Constants and Types
import {
  MAP_DRAWING_REDUCER_KEY,
  drawingSlice,
} from "../redux/map/drawingSlice";

export const MapScreen = () => {
  const mapRef = React.useRef<MapView>(null);
  const dispatch = useAppDispatch();

  const [currentLocation, setCurrentLocation] = React.useState({} as LatLng);
  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );

  const onPress = useCallback(
    (event: MapPressEvent) => {
      console.log("Map Pressed");
      if (isDrawing) {
        dispatch(
          drawingSlice.actions.addPointToPolygon(event.nativeEvent.coordinate)
        );
      }
    },
    [isDrawing]
  );

  const onMapReady = useCallback(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ).then((granted) => {
      alert(granted); // just to ensure that permissions were granted
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords as LatLng);
      })();
    });
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        onPress={onPress}
        showsUserLocation={true}
        showsCompass={true}
        showsMyLocationButton={false}
        followsUserLocation={true}
        onMapReady={onMapReady}
        provider={PROVIDER_GOOGLE}
        mapType="hybrid"
        userLocationUpdateInterval={5000}
        region={{
          latitude: currentLocation.latitude || 37.78825,
          longitude: currentLocation.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <MapContentManager mapRef={mapRef} />
      </MapView>
      <UserLocationButton currentLocation={currentLocation} mapRef={mapRef} />
      {true || isDrawing ? <DrawingButtons /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
});
