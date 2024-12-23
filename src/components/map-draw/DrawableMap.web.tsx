import React, { useRef, useState } from "react";
import MapView, { MapRef } from "react-map-gl";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, View } from "react-native";
import { defaultRegion } from "../../constants/constants";
import { RootState } from "../../redux/store";
import { DrawingManager } from "./DrawingManager.web";
import { DrawingButtons } from "./DrawingButtons.web";
import { SubmitButton } from "./SubmitButton";
import { OperationsModal } from "./OperationsModal";
import { MapContentManager } from "../map/MapContentManager.web";
import { useSelectedGrowerAndFarm } from "../layout/topBar/selectionHooks";
import { useGetFieldsQuery } from "../../redux/fields/fieldsApi";
import { MapUtilButtons } from "./MapUtilButtons";
import DrawingInfoText from "./DrawingInfoText";

export const DrawableMapScreen = () => {
  const dispatch = useDispatch();
  const mapRef = useRef<MapRef>(null);
  const initialRegion = useSelector((state: RootState) => state.map.region);
  const operation = useSelector(
    (state: RootState) => state["map-drawing"].operation
  );
  const isDrawing = useSelector(
    (state: RootState) => state["map-drawing"].isDrawing
  );
  const [modalVisible, setModalVisible] = useState(false);

  const { selectedGrower, selectedFarm } = useSelectedGrowerAndFarm();
  const { data: fieldResponse } = useGetFieldsQuery({
    growerId: selectedGrower?.ID as number,
    farmId: selectedFarm?.ID as number,
    withBoundaries: true,
    withCrops: true,
  });
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        reuseMaps
        mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        initialViewState={initialRegion || defaultRegion}
        attributionControl={false}
        style={{ flex: 1 }}
        // onClick={onPress}
      >
        <DrawingButtons
          mapRef={mapRef}
          setModalVisible={setModalVisible}
          displayControlsDefault={false}
          onCreate={(evt) => {
            console.log("onCreate", evt.features);
          }}
          onDelete={(evt) => {
            console.log("onDelete", evt);
          }}
          onUpdate={(evt) => {
            console.log("onUpdate", evt);
          }}
        />
        <MapContentManager mapRef={mapRef} fields={fieldResponse?.data} />
        <DrawingManager mapRef={mapRef} />
      </MapView>
      <DrawingInfoText />
      {/* @ts-expect-error TODO: mapref error*/}
      <MapUtilButtons mapRef={mapRef} />
      <SubmitButton operation={operation} setModalVisible={setModalVisible} />
      <OperationsModal
        operation={operation}
        setModalVisible={setModalVisible}
        visible={modalVisible}
        // @ts-expect-error TODO: mapref error
        mapRef={mapRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 0,
    flex: 1,
    // height: "100%",
  },
});
