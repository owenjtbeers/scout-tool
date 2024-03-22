import React, { RefObject } from "react";
import { Text } from "react-native";
import { Field } from "../../redux/fields/types";
import centroid from "@turf/centroid";
import MapView, { Marker, Geojson } from "react-native-maps";
import { useTheme } from "@rneui/themed";
import { colors } from "../../constants/styles";
import {
  FeatureCollection,
  Polygon as TurfPolygon,
  Position,
} from "@turf/helpers";
import { mapCoordinatesToLatLng } from "../../utils/latLngConversions";
import {
  GLOBAL_SELECTIONS_REDUCER_KEY,
  globalSelectionsSlice,
} from "../../redux/globalSelections/globalSelectionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type MapContentManagerProps = {
  mapRef: RefObject<MapView>;
  fields: Field[] | undefined;
};

export const MapContentManager = (props: MapContentManagerProps) => {
  const { fields, mapRef } = props;
  const selectedField = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].field
  );
  const { theme } = useTheme();
  const dispatch = useDispatch();
  return (
    <>
      {fields &&
        fields.map((field) => {
          const featureCollection = field.ActiveBoundary?.Json;
          if (!featureCollection) {
            return null;
          }
          let centroidOfPolygon = undefined;
          try {
            centroidOfPolygon = centroid(
              featureCollection as FeatureCollection
            );
          } catch (e) {
            console.error("Error calculating centroid", e);
          }
          const centroidLatLng = mapCoordinatesToLatLng([
            centroidOfPolygon?.geometry.coordinates as Position,
          ]);
          return (
            <React.Fragment key={`fragment-${field.ID}`}>
              {centroidLatLng[0]?.latitude !== undefined && (
                <Marker
                  // key={`marker-${field.ID}`}
                  coordinate={centroidLatLng[0]}
                  tracksViewChanges={false}
                >
                  <Text key={`text-${field.ID}`}>{field.Name}</Text>
                </Marker>
              )}
              {field.ActiveBoundary?.Json && (
                <Geojson
                  // @ts-ignore TODO: Figure out how to resolve this between the two libraries
                  geojson={field.ActiveBoundary?.Json}
                  strokeColor={theme.colors.primary}
                  fillColor={
                    selectedField?.ID === field.ID
                      ? colors.selectedFieldBoundaryFill
                      : colors.tertiary
                  }
                  tappable
                  onPress={(geoJsonProps) => {
                    if (selectedField?.ID !== field.ID) {
                      // Set the selected field in the global selections
                      dispatch(globalSelectionsSlice.actions.setField(field));
                      const { coordinates } = geoJsonProps;
                      if (coordinates && mapRef.current) {
                        console.log("Fitting to coordinates", coordinates);
                        // TODO: Figure out how to deal with this error
                        props.mapRef.current?.fitToCoordinates(coordinates, {
                          edgePadding: {
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          },
                          animated: true,
                        });
                      }
                    } else {
                      dispatch(globalSelectionsSlice.actions.setField(null));
                    }
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
    </>
  );
};
