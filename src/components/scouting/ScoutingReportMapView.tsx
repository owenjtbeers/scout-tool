import React from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { MapContentManager } from "../map/MapContentManager";
import { Field } from "../../redux/fields/types";
import { RootState, store } from "../../redux/store";
import { useSelector } from "react-redux";
import { defaultRegion } from "../../constants/constants";
import { ScoutingMapContentManager } from "./ScoutingMapContentManager";
import { ScoutingDrawingManager } from "./scout-draw/ScoutingDrawingManager";
import { ScoutingDrawingButtons } from "./scout-draw/ScoutingDrawingButtons";
import { Button } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { drawingSlice } from "../../redux/map/drawingSlice";
import DrawingInfoText from "../map-draw/DrawingInfoText";
import { featureCollection } from "@turf/helpers";
import { mapLatLngToCoordinates } from "../../utils/latLngConversions";
import getPathFromState from "expo-router/build/fork/getPathFromState";

import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import type { ScoutingReportForm } from "./types";

interface ScoutingReportMapViewProps {
  fields: Field[];
  getFormValues: UseFormGetValues<ScoutingReportForm>;
  setFormValue: UseFormSetValue<ScoutingReportForm>;
  setSideSheetContentType: (contentType: "summary" | "observation") => void;
}

export const ScoutingReportMapView = (props: ScoutingReportMapViewProps) => {
  const { fields, getFormValues, setFormValue, setSideSheetContentType } =
    props;
  const dispatch = useDispatch();
  const initialRegion = useSelector((state: RootState) => state.map.region);
  const mapRef = React.useRef<MapView>(null);

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
      }
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {isDrawing ? <ScoutingDrawingButtons mapRef={mapRef} /> : null}
      <MapView
        style={styles.map}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        region={initialRegion || defaultRegion}
        mapType={"hybrid"}
        showsUserLocation={true}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        onPress={onPress}
      >
        <ScoutingMapContentManager
          mapRef={mapRef}
          fields={fields}
          scoutingAreas={getFormValues("scoutingAreas")}
        />
        <ScoutingDrawingManager mapRef={mapRef} />
      </MapView>
      <DrawingInfoText />
      {isDrawing ? (
        <Button
          onPress={() => {
            const drawingState = drawingSlice.selectSlice(store.getState());
            // Save all drawn areas to state
            if (
              drawingState.polygons.length > 0 ||
              drawingState.points.length > 0 ||
              drawingState.polylines.length > 0
            ) {
              const fc = featureCollection([]);
              // Save all polygons
              drawingState.polygons.forEach((polygon) => {
                fc.features.push({
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Polygon",
                    coordinates: mapLatLngToCoordinates(polygon),
                  },
                });
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
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: mapLatLngToCoordinates(polyline),
                  },
                });
              });
              const nextIndex = getFormValues("scoutingAreas").length;
              setFormValue(`scoutingAreas.${nextIndex}`, {
                id: 0,
                // TODO: Handle the case where there are more than 26 scouting areas
                uuid: String.fromCharCode("A".charCodeAt(0) + (nextIndex % 26)),
                area: fc,
                reportId: 0,
                weedObservations: [],
                insectObservations: [],
                diseaseObservations: [],
                generalObservations: [],
              });
            }
            dispatch(
              drawingSlice.actions.setIsDrawing({
                drawMode: null,
                isDrawing: false,
              })
            );
            dispatch(drawingSlice.actions.clearAllShapes());
            setSideSheetContentType("observation");
          }}
          title={"Finish with Scouting Area"}
        ></Button>
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
