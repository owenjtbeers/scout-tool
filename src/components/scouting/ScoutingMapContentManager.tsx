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
import { ScoutingArea } from "../../redux/scouting/types";

type MapContentManagerProps = {
  mapRef: RefObject<MapView>;
  fields: Field[] | undefined;
  scoutingAreas: ScoutingArea[];
};

export const ScoutingMapContentManager = (props: MapContentManagerProps) => {
  const { fields, scoutingAreas } = props;
  const { theme } = useTheme();
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
                  fillColor={colors.tertiary}
                />
              )}
            </React.Fragment>
          );
        })}
      {scoutingAreas.map((scoutArea) => {
        const area = scoutArea?.area;
        return (
          <React.Fragment key={`${scoutArea.uuid}`}>
            {area && (
              <Geojson
                // @ts-ignore TODO: Figure out how to resolve this between the two libraries
                geojson={area}
                strokeColor={theme.colors.primary}
                fillColor={colors.tertiary}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
