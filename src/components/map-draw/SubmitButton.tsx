import React from "react";
import { TouchableOpacity, View, StyleSheet, Text, Alert } from "react-native";
import { Button } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { DrawingOperation } from "../../redux/map/drawingSlice";
import { colors } from "../../constants/styles";
import { set } from "react-hook-form";

type SubmitButtonProps = {
  operation: DrawingOperation;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const operationTranslations = {
  "add-field": "Submit New Field",
  "edit-field": "Save Changes",
  "upload-shapefile": "Upload Shapefile",
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  operation,
  setModalVisible,
}) => {
  const isDrawing = useSelector(
    (state: RootState) => state["map-drawing"].isDrawing
  );
  const polygons = useSelector((state: RootState) => state["map-drawing"].polygons);
  const handlePress = () => {
    if (polygons?.[0] === undefined || polygons?.[0]?.length < 3) {
      Alert.alert("Please draw a field before proceeding");
      return;
    }
    if (operation === "add-field") {
      // Perform add field operation
      // console.log("Add field operation");
      setModalVisible(true);
    } else if (operation === "edit-field") {
      // Perform edit field operation
      // console.log("Edit field operation");
    }
  };

  return (
    <View style={styles.container}>
      <Button
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.buttonContainer}
        onPress={handlePress}
        activeOpacity={0.8}
        title={operation ? operationTranslations[operation] : "Submit"}
        titleStyle={styles.submitText}
        disabled={isDrawing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: 65,
  },
  buttonContainer: {
    flex: 1,
    minHeight: 50,
    borderRadius: 0,
  },
  submitText: {
    fontSize: 20,
    fontWeight: "800",
  },
});
