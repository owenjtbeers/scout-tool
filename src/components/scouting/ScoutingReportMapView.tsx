import { Button } from "@rneui/themed";
import {
  Feature,
  featureCollection,
  LineString,
  Properties,
} from "@turf/helpers";
import React, { useEffect } from "react";
import { View } from "react-native";
import MapView from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { defaultRegion } from "../../constants/constants";
import { Field } from "../../redux/fields/types";
import { drawingSlice, DrawMode } from "../../redux/map/drawingSlice";
import { RootState, store } from "../../redux/store";
import {
  convertRNMapsPolygonToTurfFeature,
  mapCoordinatesToLatLng,
  mapLatLngToCoordinates,
} from "../../utils/latLngConversions";
import DrawingInfoText from "../map-draw/DrawingInfoText";
import { ScoutingMapContentManager } from "./ScoutingMapContentManager";
import { EmailScoutReportButton } from "./email/EmailScoutReportButton";
import { ScoutingDrawingButtons } from "./scout-draw/ScoutingDrawingButtons";
import { ScoutingDrawingManager } from "./scout-draw/ScoutingDrawingManager";

import bbox from "@turf/bbox";
import { type UseFormGetValues, type UseFormSetValue } from "react-hook-form";
import { convertTurfBBoxToLatLng } from "../../utils/latLngConversions";
import FreehandDrawing from "../map-draw/FreeHandDraw";
import { MapUtilButtons } from "../map/components/MapUtilButtons";
import { fitToBoundsForMapView } from "../map/utils";
import type { ScoutingReportForm } from "./types";

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
      setFormValue("scoutingAreas.0.Geometry.features", convertedPolylines, {
        shouldDirty: true,
      });
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
  useEffect(() => {
    // Center the map on the field boundary
    const fieldBoundary = getFormValues("field.ActiveBoundary.Json");
    if (fieldBoundary && mapRef.current !== null) {
      const fc = featureCollection(fieldBoundary.features);
      const bboxOfFields = bbox(fc);
      fitToBoundsForMapView(mapRef, convertTurfBBoxToLatLng(bboxOfFields));
    }
  }, [mapRef.current]);

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
      <MapUtilButtons mapRef={mapRef} fields={fields} />
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
