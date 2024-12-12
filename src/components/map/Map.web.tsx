import React, { useCallback } from "react";
import { View, StyleSheet, PermissionsAndroid, Platform } from "react-native";
import MapView, { LatLng, Region } from "react-native-maps";
// TODO Revisit this on another day
// import MapBoxGL from "@rnmapbox/maps"
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/store";
import * as Location from "expo-location";

// Components
import { MapContentManager } from "./MapContentManager";

// Data
import { RootState } from "../../redux/store";

// Constants and Types
import { mapSlice, MAP_REDUCER_KEY } from "../../redux/map/mapSlice";
import AnimatedMapActionButtons, {
  SelectedFieldSpeedDial,
} from "./components/AnimatedMapActionButtons";
import { defaultRegion } from "../../constants/constants";
import { useGetFieldsQuery } from "../../redux/fields/fieldsApi";
import { useSelectedGrowerAndFarm } from "../layout/topBar/selectionHooks";
import { MapUtilButtons } from "./components/MapUtilButtons";
import { EditFieldCropHistoryPage } from "../fields/EditFieldCropHistoryPage";

export const MapScreen = () => {
  const mapRef = React.useRef<MapView>(null);
  const dispatch = useAppDispatch();

  const [isEditingFieldCropHistory, setIsEditingFieldCropHistory] =
    React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState({} as LatLng);
  const onMapReady = useCallback(() => {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((granted) => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            alert(
              "Permission to access location was denied, some features may not work correctly"
            );
            return;
          }
          let location = await Location.getCurrentPositionAsync({});
          setCurrentLocation(location.coords as LatLng);
        })();
      });
    }
  }, []);

  const onRegionChange = useCallback((region: Region) => {
    dispatch(mapSlice.actions.setRegion(region));
  }, []);
  const initialRegion = useSelector((state: RootState) => {
    return state[MAP_REDUCER_KEY].region;
  });

  const { selectedGrower, selectedFarm } = useSelectedGrowerAndFarm();
  const { data: fieldResponse } = useGetFieldsQuery({
    growerId: selectedGrower?.ID as number,
    farmId: selectedFarm?.ID as number,
    withBoundaries: true,
    withCrops: true,
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={"google"}
        // @ts-expect-error because of the Interface mismatch from teovilla to react-native-maps
        googleMapsApiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY}
        ref={mapRef}
        showsUserLocation={true}
        showsCompass={true}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        onMapReady={onMapReady}
        toolbarEnabled={false}
        mapType={"hybrid"}
        userLocationUpdateInterval={5000}
        initialRegion={
          initialRegion || {
            ...defaultRegion,
            latitude: currentLocation.latitude || defaultRegion.latitude,
            longitude: currentLocation.longitude || defaultRegion.longitude,
          }
        }
        onRegionChangeComplete={onRegionChange}
      >
        <MapContentManager mapRef={mapRef} fields={fieldResponse?.data} />
      </MapView>
      <MapUtilButtons mapRef={mapRef} fields={fieldResponse?.data} />
      <AnimatedMapActionButtons />
      <SelectedFieldSpeedDial
        onEditCropHistory={() => setIsEditingFieldCropHistory(true)}
      />
      {isEditingFieldCropHistory ? (
        <EditFieldCropHistoryPage
          isVisible={isEditingFieldCropHistory}
          onClose={() => setIsEditingFieldCropHistory(false)}
        />
      ) : null}
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
