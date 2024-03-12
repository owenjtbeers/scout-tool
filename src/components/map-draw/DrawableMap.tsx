import React, { useRef, useState } from "react";
import MapView, { MapPressEvent, PROVIDER_GOOGLE } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet } from "react-native";

import { defaultRegion } from "../../constants/constants";
import { RootState } from "../../redux/store";
import { DrawingManager } from "./DrawingManager";
import { drawingSlice } from "../../redux/map/drawingSlice";
import { DrawingButtons } from "./DrawingButtons";
import { SubmitButton } from "./SubmitButton";
import { OperationsModal } from "./OperationsModal";
import { MapContentManager } from "../map/MapContentManager";
import { useSelectedGrowerAndFarm } from "../layout/topBar/selectionHooks";
import { useGetFieldsQuery } from "../../redux/fields/fieldsApi";

export const DrawableMapScreen = () => {
  const dispatch = useDispatch();
  const mapRef = useRef<MapView>(null);
  const initialRegion = useSelector((state: RootState) => state.map.region);
  const operation = useSelector(
    (state: RootState) => state["map-drawing"].operation
  );
  const isDrawing = useSelector(
    (state: RootState) => state["map-drawing"].isDrawing
  );
  const [modalVisible, setModalVisible] = useState(false);

  const onPress = (event: MapPressEvent) => {
    if (!!isDrawing) {
      dispatch(
        drawingSlice.actions.addPointToPolygon(event.nativeEvent.coordinate)
      );
    }
  };

  const { selectedGrower, selectedFarm } = useSelectedGrowerAndFarm();
  const { data: fieldResponse } = useGetFieldsQuery({
    growerId: selectedGrower?.ID as number,
    farmId: selectedFarm?.ID as number,
    withBoundaries: true,
  });
  return (
    <>
      <DrawingButtons setModalVisible={setModalVisible} />
      <MapView
        style={styles.map}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        region={initialRegion || defaultRegion}
        onPress={onPress}
        onMapReady={() => {}}
        mapType={"hybrid"}
        showsUserLocation={true}
      >
        <MapContentManager mapRef={mapRef} fields={fieldResponse?.data} />
        <DrawingManager mapRef={mapRef} />
      </MapView>
      <SubmitButton operation={operation} setModalVisible={setModalVisible} />
      <OperationsModal
        operation={operation}
        setModalVisible={setModalVisible}
        visible={modalVisible}
      />
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
