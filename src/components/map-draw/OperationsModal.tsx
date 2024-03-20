import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import type { Units } from "@turf/helpers";
import { CreateFieldForm } from "./CreateFieldForm";
import { DrawingOperation } from "../../redux/map/drawingSlice";
import { UploadShapeFileForm } from "./UploadShapeFileForm";
import MapView from "react-native-maps";

type OperationsModalProps = {
  operation: DrawingOperation;
  visible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  mapRef: React.RefObject<MapView>;
};

const units = ["acres", "hectares"] as Units[];

export const OperationsModal: React.FC<OperationsModalProps> = (props) => {
  const { operation, visible, setModalVisible } = props;
  const [areaUnit, setAreaUnit] = useState(units[0]);

  const onError = (errors: any) => {
    console.log(errors);
  };

  return (
    <View style={styles.centeredView}>
      {operation === ("upload-shapefile" as DrawingOperation) ? (
        <UploadShapeFileForm mapRef={props.mapRef} setModalVisible={setModalVisible}/>
      ) : (
        // TODO Make this play nice with the keyboard
        <CreateFieldForm
          areaUnit={areaUnit}
          isVisible={visible}
          setIsVisible={setModalVisible}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {},
  modalView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  formBackground: {
    backgroundColor: "lightgray",
    padding: 10,
  },
  formView: {
    // alignContent: "flex-end",
    // justifyContent: "flex-end",
    padding: 10,
    width: "100%",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 5,
  },
  closeButton: {
    paddingRight: 20,
  },
  input: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "gray",
    backgroundColor: "white",
    margin: 10,
  },
  inputTitleText: {
    paddingLeft: 10,
  },
  errorMessage: {
    paddingLeft: 10,
  },
});
