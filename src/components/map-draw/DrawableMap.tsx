import React, { useRef, useState } from "react";
import MapView, { MapPressEvent, PROVIDER_GOOGLE } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { MapUtilButtons } from "./MapUtilButtons";
import DrawingInfoText from "./DrawingInfoText";

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
        drawingSlice.actions.addPointToPolygon({
          index: 0,
          point: event.nativeEvent.coordinate,
        })
      );
    }
  };

  const { selectedGrower, selectedFarm } = useSelectedGrowerAndFarm();
  const { data: fieldResponse } = useGetFieldsQuery({
    growerId: selectedGrower?.ID as number,
    farmId: selectedFarm?.ID as number,
    withBoundaries: true,
    withCrops: true,
  });
  return (
    <View style={styles.container}>
      <DrawingButtons setModalVisible={setModalVisible} />
      <MapView
        style={styles.map}
        ref={mapRef}
        // provider={"google"}
        // googleMapsApiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY}
        region={initialRegion || defaultRegion}
        onPress={onPress}
        mapType={"hybrid"}
        showsUserLocation={true}
        showsMyLocationButton={false}
        toolbarEnabled={false}
      >
        <MapContentManager mapRef={mapRef} fields={fieldResponse?.data} />
        <DrawingManager mapRef={mapRef} />
      </MapView>
      <DrawingInfoText />
      <MapUtilButtons mapRef={mapRef} />
      <SubmitButton operation={operation} setModalVisible={setModalVisible} />
      <OperationsModal
        operation={operation}
        setModalVisible={setModalVisible}
        visible={modalVisible}
        mapRef={mapRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  map: {
    flex: 1,
    // height: "100%",
  },
});
