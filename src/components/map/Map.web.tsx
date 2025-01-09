import React, { useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
// TODO Revisit this on another day
import MapView, { ViewStateChangeEvent, MapRef } from "react-map-gl";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/store";

// Components
import { MapContentManager } from "./MapContentManager.web";

// Data
import { RootState } from "../../redux/store";

// Constants and Types
import { mapSlice, MAP_REDUCER_KEY } from "../../redux/map/mapSlice";
import { defaultRegion } from "../../constants/constants";
import { useGetFieldsQuery } from "../../redux/fields/fieldsApi";
import { useSelectedGrowerAndFarm } from "../layout/topBar/selectionHooks";
import { MapUtilButtons } from "./components/MapUtilButtons.web";
import { SOURCE_FIELD_LABEL_PREFIX, SOURCE_FIELD_PREFIX } from "./constants";
import {
  globalSelectionsSlice,
  GLOBAL_SELECTIONS_REDUCER_KEY,
} from "../../redux/globalSelections/globalSelectionsSlice";
import { zoomToFieldBoundaryMapGL } from "./utilsMapbox";

export const MapScreen = () => {
  const mapRef = React.useRef<MapRef>(null);
  const dispatch = useAppDispatch();

  const onRegionChange = useCallback((event: ViewStateChangeEvent) => {
    console.log("onRegionChange", event);
    dispatch(mapSlice.actions.setRegion(event.viewState));
  }, []);

  const initialRegion = useSelector((state: RootState) => {
    return state[MAP_REDUCER_KEY].region;
  });

  const { selectedGrower, selectedFarm } = useSelectedGrowerAndFarm();
  const selectedField = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].field
  );
  const { data: fieldResponse } = useGetFieldsQuery({
    growerId: selectedGrower?.ID as number,
    farmId: selectedFarm?.ID as number,
    withActiveBoundary: true,
    withCrops: true,
  });
  return (
    <>
      <MapView
        style={styles.map}
        reuseMaps
        mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
        onMoveEnd={(event) => {
          onRegionChange(event);
        }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        ref={mapRef}
        initialViewState={
          initialRegion || {
            ...defaultRegion,
            latitude: defaultRegion.latitude,
            longitude: defaultRegion.longitude,
          }
        }
        onClick={(e) => {
          const features = mapRef.current?.queryRenderedFeatures(e.point);
          if (features && features.length > 0) {
            const source = features[0]?.source || "";
            const fieldId = getFieldIdFromSource(source);
            const field = fieldResponse?.data?.find((f) => f.ID === fieldId);
            if (field && selectedField?.ID !== field.ID) {
              dispatch(globalSelectionsSlice.actions.setField(field));
              if (field.ActiveBoundary?.Json) {
                zoomToFieldBoundaryMapGL(mapRef, field.ActiveBoundary.Json);
              }
            } else {
              dispatch(globalSelectionsSlice.actions.setField(null));
            }
          }
        }}
      >
        <MapContentManager mapRef={mapRef} fields={fieldResponse?.data} />
      </MapView>
      <MapUtilButtons mapRef={mapRef} fields={fieldResponse?.data} />
    </>
  );
};

export default MapScreen;
const getFieldIdFromSource = (source: string) => {
  const prefixes = [SOURCE_FIELD_LABEL_PREFIX, SOURCE_FIELD_PREFIX];
  if (source) {
    for (const prefix of prefixes) {
      if (source.startsWith(prefix)) {
        // It follows that the field id is the remainder of the source string
        // Return the field id
        return Number(source.substring(prefix.length));
      }
    }
  }
  return undefined;
};
const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
