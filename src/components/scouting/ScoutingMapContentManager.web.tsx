import React, { RefObject } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import centroid from "@turf/centroid";
import type { Feature, LineString } from "@turf/helpers";
import { FeatureCollection, Position } from "@turf/helpers";

import { Text, View } from "react-native";
import { MapRef } from "react-map-gl";
import { GeojsonLayerGL } from "../map/components/GeojsonLayer.web";
import { useSelector } from "react-redux";
import {
  DEFAULT_POLYLINE_STROKE_WIDTH,
  WEB_POLYLINE_STROKE_WIDTH,
} from "../../constants/constants";
import { Field } from "../../redux/fields/types";
import { MAP_DRAWING_REDUCER_KEY } from "../../redux/map/drawingSlice";
import {
  ObservationTypePrefix,
  ScoutingArea,
} from "../../redux/scouting/types";
import { RootState } from "../../redux/store";
import {
  featureCollectionToLatLngCoordinates,
  mapCoordinatesToLatLng,
} from "../../utils/latLngConversions";
import { PestPointComponent } from "../map-draw/pest-points/PestPointComponent";
import { Geojson } from "react-native-maps";

type MapContentManagerProps = {
  mapRef: RefObject<MapRef>;
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

          const convertedFeatureCollectionToLatLngCoordinates =
            featureCollectionToLatLngCoordinates(
              // @ts-expect-error
              field.ActiveBoundary?.Json
            );
          return (
            <React.Fragment key={`fragment-${field.ID}`}>
              <GeojsonLayerGL
                geojson={featureCollection as FeatureCollection}
                color={"red"}
                ID={field.ID}
                fillOpacity={0.01}
                label={field.Name}
              />
            </React.Fragment>
          );
        })}
      {scoutingAreas.map((scoutArea, index) => {
        const area: FeatureCollection = scoutArea?.Geometry;
        // @ts-ignore TODO: Figure out how to resolve having the JSON in two different places potentially ;
        if (!area?.features?.length) {
          return null;
        }
        if (drawMode === "polyline" && scoutArea.Type === "Main") {
          // Don't draw the main area while we are editing. This is handled by the drawing manager
          return null;
        } else if (drawMode !== "polyline" && scoutArea.Type === "Main") {
          // Loop through the features and draw them instead so we can control strokeColor
          return (
            <React.Fragment key={`${scoutArea.UId}-${index}`}>
              {area.features.map((feature, index) => {
                const id = `${scoutArea.UId}-${index}`;
                return (
                  <GeojsonLayerGL
                    // @ts-expect-error
                    geojson={feature}
                    color={
                      feature.properties?.strokeColor || theme.colors.primary
                    }
                    fillOpacity={0.01}
                    strokeWidth={WEB_POLYLINE_STROKE_WIDTH}
                    ID={id}
                    key={id}
                  />
                );
              })}
            </React.Fragment>
          );
        }

        if (drawMode === "pest-point" && scoutArea.Type !== "Main") {
          // Don't draw the pest points while we are editing. This is handled by the drawing manager
          return null;
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
                strokeWidth={DEFAULT_POLYLINE_STROKE_WIDTH}
                // fillColor={colors.tertiary}
                title={scoutArea.UId}
                tracksViewChanges={false}
                markerComponent={
                  <CustomMarkerComponent
                    text={scoutArea.UId}
                    scoutArea={scoutArea}
                  />
                }
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

const CustomMarkerComponent = ({
  text,
  scoutArea,
}: {
  text: string;
  scoutArea: ScoutingArea;
}) => {
  const pestPoint = {
    // TODO: Come back to this when I get colors set up for Alias's
    color: "red",
    type: scoutArea?.Alias?.Type as ObservationTypePrefix,
    Alias: scoutArea?.Alias,
    coordinates: { latitude: 0, longitude: 0 }, // Just a placeholder to match interfaces
  };
  if (pestPoint.Alias) {
    return <PestPointComponent pestPoint={pestPoint} />;
  }
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
