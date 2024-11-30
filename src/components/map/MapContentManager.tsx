import { useTheme } from "@rneui/themed";
import bbox from "@turf/bbox";
import centroid from "@turf/centroid";
import {
  Feature,
  FeatureCollection,
  Position,
  featureCollection,
} from "@turf/helpers";
import React, { RefObject, useCallback, useEffect } from "react";
import { Platform, Text } from "react-native";
import MapView, { Geojson, Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../constants/styles";
import { useGetOrgCropsQuery } from "../../redux/crops/cropsApi";
import {
  getColorForFieldCropSeason,
  setOpacityOnHexColor,
} from "../../redux/crops/utils";
import { Field } from "../../redux/fields/types";
import {
  GLOBAL_SELECTIONS_REDUCER_KEY,
  globalSelectionsSlice,
} from "../../redux/globalSelections/globalSelectionsSlice";
import { RootState } from "../../redux/store";
import {
  convertTurfBBoxToLatLng,
  mapCoordinatesToLatLng,
} from "../../utils/latLngConversions";
import { fitToBoundsForMapView } from "./utils";

type MapContentManagerProps = {
  mapRef: RefObject<MapView>;
  fields: Field[] | undefined;
};

export const MapContentManager = (props: MapContentManagerProps) => {
  const { fields, mapRef } = props;
  const selectedField = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].field
  );
  const selectedSeason = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].season
  );
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { data: orgCropsData } = useGetOrgCropsQuery("default", {
    refetchOnReconnect: true,
  });
  const onPressFieldBoundary = useCallback(
    (field: Field) => (geoJsonProps: any) => {
      if (selectedField?.ID !== field.ID) {
        // Set the selected field in the global selections
        dispatch(globalSelectionsSlice.actions.setField(field));
        const { coordinates } = geoJsonProps;
        if (coordinates && mapRef.current) {
          // TODO: Figure out how to deal with this error
          // @ts-ignore
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
    },
    [selectedField]
  );
  const shouldZoomToBbox = useSelector((state: RootState) => {
    return state[GLOBAL_SELECTIONS_REDUCER_KEY].shouldZoomToBbox;
  });
  useEffect(() => {
    if (shouldZoomToBbox && fields?.length) {
      const features = fields.reduce((acc, field) => {
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
        fitToBoundsForMapView(mapRef, convertTurfBBoxToLatLng(bboxOfFields));
        dispatch(globalSelectionsSlice.actions.setShouldZoomToBbox(false));
      }
    }
  }, [shouldZoomToBbox]);
  return (
    <>
      {fields &&
        fields.map((field) => {
          const featureCollection = field?.ActiveBoundary?.Json;
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
          const fieldColor = getColorForFieldCropSeason(
            orgCropsData?.data,
            field.FieldCrops,
            selectedSeason
          );
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
                  strokeColor={fieldColor}
                  fillColor={setOpacityOnHexColor(fieldColor)}
                  tappable={true}
                  // tracksViewChanges={true}
                  // onClick={onPressFieldBoundary(field)}
                  onPress={onPressFieldBoundary(field)}
                  // zIndex={100000000}
                  key={`polygon-${field.ID}`}
                />
              )}
            </React.Fragment>
          );
        })}
    </>
  );
};
