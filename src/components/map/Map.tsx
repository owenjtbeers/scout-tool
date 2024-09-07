import React, { useCallback, useEffect } from "react";
import { View, StyleSheet, PermissionsAndroid } from "react-native";
import MapView, { LatLng, PROVIDER_GOOGLE, Region } from "react-native-maps";
// TODO Revisit this on another day
// import MapBoxGL from "@rnmapbox/maps"
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/store";
import * as Location from "expo-location";

// Components
import { MapContentManager } from "./MapContentManager";
import UserLocationButton from "./components/UserLocationButton";
import FieldBoundsZoomButton from "./components/FieldBoundsZoomButton";

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
import { Feature, FeatureCollection, featureCollection } from "@turf/helpers";
import bbox from "@turf/bbox";
import {
  convertTurfBBoxToLatLng,
  mapCoordinatesToLatLng,
} from "../../utils/latLngConversions";
import MapUtilButtons from "./components/MapUtilButtons";
import {
  GLOBAL_SELECTIONS_REDUCER_KEY,
  globalSelectionsSlice,
} from "../../redux/globalSelections/globalSelectionsSlice";
import { EditFieldCropHistoryPage } from "../fields/EditFieldCropHistoryPage";

export const MapScreen = () => {
  const mapRef = React.useRef<MapView>(null);
  const dispatch = useAppDispatch();

  const [isEditingFieldCropHistory, setIsEditingFieldCropHistory] =
    React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState({} as LatLng);
  const onMapReady = useCallback(() => {
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
  const shouldZoomToBbox = useSelector((state: RootState) => {
    return state[GLOBAL_SELECTIONS_REDUCER_KEY].shouldZoomToBbox;
  });
  useEffect(() => {
    if (shouldZoomToBbox && fieldResponse?.data?.length) {
      const features = fieldResponse.data.reduce((acc, field) => {
        const activeBoundary = field?.ActiveBoundary?.Json;
        if (activeBoundary && activeBoundary.features?.length > 0) {
          activeBoundary.features.forEach((feature) => {
            acc.push(feature);
          });
        }
        return acc;
      }, [] as Feature[]);
      const fc = featureCollection(features);
      const bboxOfFields = bbox(fc);
      if (bboxOfFields) {
        mapRef.current?.fitToCoordinates(
          convertTurfBBoxToLatLng(bboxOfFields),
          {
            edgePadding: {
              top: 50,
              right: 50,
              bottom: 50,
              left: 50,
            },
          }
        );
        dispatch(globalSelectionsSlice.actions.setShouldZoomToBbox(false));
      }
    }
  }, [shouldZoomToBbox]);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        showsUserLocation={true}
        showsCompass={true}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        followsUserLocation={false}
        onMapReady={onMapReady}
        toolbarEnabled={false}
        // provider={PROVIDER_GOOGLE}
        mapType="hybrid"
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
