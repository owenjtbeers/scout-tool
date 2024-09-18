import React, { RefObject } from "react";
import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Field } from "../../redux/fields/types";
import centroid from "@turf/centroid";
import MapView, { Marker, Geojson, Polyline } from "react-native-maps";
import { useTheme } from "@rneui/themed";
import { colors } from "../../constants/styles";
import {
  FeatureCollection,
  Polygon as TurfPolygon,
  Position,
} from "@turf/helpers";
import { mapCoordinatesToLatLng } from "../../utils/latLngConversions";
import { ScoutingArea } from "../../redux/scouting/types";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { MAP_DRAWING_REDUCER_KEY } from "../../redux/map/drawingSlice";
import type { Feature, LineString } from "@turf/helpers";
import { DEFAULT_POLYLINE_STROKE_WIDTH } from "../../constants/constants";

type MapContentManagerProps = {
  mapRef: RefObject<MapView>;
  fields: Field[] | undefined;
  scoutingAreas: ScoutingArea[];
};

export const ScoutingMapContentManager = (props: MapContentManagerProps) => {
  const { fields, scoutingAreas } = props;
  const { theme } = useTheme();
  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );
  const drawMode = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].drawMode
  );
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
      {scoutingAreas.map((scoutArea, index) => {
        const area: FeatureCollection = scoutArea.Geometry;
        // @ts-ignore TODO: Figure out how to resolve having the JSON in two different places potentially ;
        if (!area?.features?.length) {
          return null;
        }
        if (isDrawing && drawMode === "polyline" && scoutArea.UId === "Main") {
          // Don't draw the main area while we are editing
          return null;
        } else if (!isDrawing && scoutArea.UId === "Main") {
          // Loop through the features and draw them instead so we can control strokeColor
          return (
            <React.Fragment key={`${scoutArea.UId}-${index}`}>
              {area.features.map((feature, index) => {
                const feature2 = feature as Feature<LineString>;
                return (
                  <Polyline
                    // @ts-ignore TODO: Figure out how to resolve this between the two libraries
                    coordinates={mapCoordinatesToLatLng(
                      feature2.geometry.coordinates
                    )}
                    strokeColor={
                      feature.properties?.strokeColor || theme.colors.primary
                    }
                    strokeWidth={DEFAULT_POLYLINE_STROKE_WIDTH}
                    // tracksViewChanges={false}
                    // fillColor={colors.tertiary}
                    key={`${scoutArea.UId}-${index}`}
                  />
                );
              })}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={`${scoutArea.UId}-${index}`}>
            {area && (
              <Geojson
                // @ts-ignore TODO: Figure out how to resolve this between the two libraries
                geojson={area}
                strokeColor={
                  area.features[0].properties?.strokeColor ||
                  theme.colors.primary
                }
                // fillColor={colors.tertiary}
                title={scoutArea.UId}
                tracksViewChanges={false}
                markerComponent={<CustomMarkerComponent text={scoutArea.UId} />}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

const CustomMarkerComponent = ({ text }: { text: string }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <FontAwesome5 name="map-marker" size={40} color={"red"}></FontAwesome5>
      <Text
        style={{
          fontSize: 20,
          color: "white",
          position: "absolute",
          textAlign: "center",
        }}
      >
        {text}
      </Text>
    </View>
  );
};
