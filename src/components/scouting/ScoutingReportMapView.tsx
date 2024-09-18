import React from "react";
import { View } from "react-native";
import MapView from "react-native-maps";
import { Field } from "../../redux/fields/types";
import { RootState, store } from "../../redux/store";
import { useSelector } from "react-redux";
import { defaultRegion } from "../../constants/constants";
import { MaterialIcons } from "@expo/vector-icons";
import { ScoutingMapContentManager } from "./ScoutingMapContentManager";
import { ScoutingDrawingManager } from "./scout-draw/ScoutingDrawingManager";
import { ScoutingDrawingButtons } from "./scout-draw/ScoutingDrawingButtons";
import { Button } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { drawingSlice, DrawMode } from "../../redux/map/drawingSlice";
import DrawingInfoText from "../map-draw/DrawingInfoText";
import {
  featureCollection,
  Feature,
  LineString,
  Properties,
} from "@turf/helpers";
import {
  convertRNMapsPolygonToTurfFeature,
  mapCoordinatesToLatLng,
  mapLatLngToCoordinates,
} from "../../utils/latLngConversions";
import { EmailScoutReportButton } from "./email/EmailScoutReportButton";

import {
  set,
  type UseFormGetValues,
  type UseFormSetValue,
} from "react-hook-form";
import type { ScoutingReportForm } from "./types";
import FreehandDrawing from "../map-draw/FreeHandDraw";
import { color } from "@rneui/base";

interface ScoutingReportMapViewProps {
  fields: Field[];
  getFormValues: UseFormGetValues<ScoutingReportForm>;
  setFormValue: UseFormSetValue<ScoutingReportForm>;
  setSideSheetContentType: (contentType: "summary" | "observation") => void;
  setIsDrawingScoutingArea: (isDrawing: boolean) => void;
  isDrawingScoutingArea: boolean;
}

export const ScoutingReportMapView = (props: ScoutingReportMapViewProps) => {
  const {
    fields,
    getFormValues,
    setFormValue,
    setSideSheetContentType,
    isDrawingScoutingArea,
    setIsDrawingScoutingArea,
  } = props;
  const dispatch = useDispatch();
  const initialRegion = useSelector((state: RootState) => state.map.region);
  const mapRef = React.useRef<MapView>(null);

  const [isProcessingEmail, setIsProcessingEmail] = React.useState(false);

  const isDrawing = useSelector(
    (state: RootState) => state["map-drawing"].isDrawing
  );
  const drawMode = useSelector(
    (state: RootState) => state["map-drawing"].drawMode
  );

  const onPress = (event: any) => {
    if (!!isDrawing) {
      switch (drawMode) {
        case "polygon":
          dispatch(
            drawingSlice.actions.addPointToPolygon({
              index: 0,
              point: event.nativeEvent.coordinate,
            })
          );
          break;
        case "point":
          dispatch(drawingSlice.actions.addPoint(event.nativeEvent.coordinate));
          break;
        // case "polyline":
        // This is handled elsewhere
      }
    }
  };

  const onDrawPress = (isDrawing: boolean, drawMode: DrawMode) => {
    if (isDrawing && drawMode === "polyline") {
      // Save the drawn polylines to form state
      // Grab the polylines from the drawing state
      const drawingState = drawingSlice.selectSlice(store.getState());
      const convertedPolylines = drawingState.polylines.map((polyline) => {
        return {
          type: "Feature",
          properties: {
            strokeColor: polyline.strokeColor,
          },
          geometry: {
            type: "LineString",
            coordinates: mapLatLngToCoordinates(polyline.coordinates),
          },
        } as Feature<LineString, Properties>;
      });
      setFormValue("scoutingAreas.0.Geometry.features", convertedPolylines);
      dispatch(drawingSlice.actions.clearAllShapes());
    } else if (!isDrawing) {
      // Put existing polylines back into drawing state for editing
      const geoJsonFeatures = getFormValues(
        "scoutingAreas.0.Geometry.features"
      );
      if (geoJsonFeatures?.length > 0) {
        const convertedFeatures = geoJsonFeatures.map((feature: Feature) => {
          const feature2 = feature as Feature<LineString, Properties>;
          return {
            coordinates: mapCoordinatesToLatLng(feature2.geometry.coordinates),
            strokeColor: feature2?.properties?.strokeColor,
          };
        });
        dispatch(drawingSlice.actions.setPolylines(convertedFeatures));
      }
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <ScoutingDrawingButtons mapRef={mapRef} onDrawPress={onDrawPress} />
      <MapView
        style={styles.map}
        ref={mapRef}
        region={initialRegion || defaultRegion}
        mapType={"hybrid"}
        showsUserLocation={true}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        onPress={onPress}
        scrollEnabled={!isDrawing}
        zoomEnabled={!isDrawing}
      >
        <ScoutingMapContentManager
          mapRef={mapRef}
          fields={fields}
          scoutingAreas={getFormValues("scoutingAreas")}
        />
        <ScoutingDrawingManager mapRef={mapRef} />
      </MapView>
      {isDrawing && drawMode === "polyline" ? (
        <FreehandDrawing mapRef={mapRef} />
      ) : null}
      <DrawingInfoText />
      {isDrawingScoutingArea ? (
        <Button
          onPress={() => {
            const drawingState = drawingSlice.selectSlice(store.getState());
            dispatch(drawingSlice.actions.clearAllShapes());
            // Save all drawn areas to state
            if (
              drawingState.polygons.length > 0 ||
              drawingState.points.length > 0 ||
              drawingState.polylines.length > 0
            ) {
              const fc = featureCollection([]);
              // Save all polygons
              drawingState.polygons.forEach((polygon) => {
                fc.features.push(convertRNMapsPolygonToTurfFeature(polygon));
              });
              // Save all points
              drawingState.points.forEach((point) => {
                fc.features.push({
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: [point.longitude, point.latitude],
                  },
                });
              });
              // Save all polylines
              drawingState.polylines.forEach((polyline) => {
                fc.features.push({
                  type: "Feature",
                  properties: {
                    strokeColor: polyline.strokeColor,
                  },
                  geometry: {
                    type: "LineString",
                    coordinates: mapLatLngToCoordinates(polyline.coordinates),
                  },
                });
              });
              const nextIndex = getFormValues("scoutingAreas").length;
              setFormValue(`scoutingAreas.${nextIndex}`, {
                ID: 0,
                // TODO: Handle the case where there are more than 26 scouting areas
                UId: String.fromCharCode("A".charCodeAt(0) + (nextIndex % 26)),
                ScoutReportId: 0,
                Geometry: fc,
                WeedObservations: [],
                InsectObservations: [],
                DiseaseObservations: [],
                GeneralObservations: [],
                Type: "PointOfInterest",
              });
            } else {
              // If no shapes were drawn, display error message
              alert("Please draw a shape, or specify a point on the map.");
              return;
            }
            dispatch(
              drawingSlice.actions.setIsDrawing({
                drawMode: null,
                isDrawing: false,
              })
            );
            setIsDrawingScoutingArea(false);
            setSideSheetContentType("observation");
          }}
          title={"Exit Drawing Mode"}
        ></Button>
      ) : null}
      {!isDrawing ? (
        <EmailScoutReportButton mapRef={mapRef} getFormValues={getFormValues} />
      ) : null}
    </View>
  );
};

const styles = {
  map: {
    flex: 1,
  },
};

export default ScoutingReportMapView;
