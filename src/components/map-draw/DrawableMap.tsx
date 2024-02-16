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

export const DrawableMapScreen = () => {
  const dispatch = useDispatch();
  const mapRef = useRef<MapView>(null);
  const initialRegion = useSelector((state: RootState) => state.map.region);
  const operation = useSelector((state: RootState) => state['map-drawing'].operation);
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
  return (
    <>
      <DrawingButtons />
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
        <DrawingManager mapRef={mapRef} />
      </MapView>
      <SubmitButton operation={operation} setModalVisible={setModalVisible} />
      <OperationsModal setModalVisible={setModalVisible} visible={modalVisible}/>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
