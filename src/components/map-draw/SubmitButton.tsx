import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
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
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({ operation, setModalVisible }) => {
  const handlePress = () => {
    if (operation === "add-field") {
      // Perform add field operation
      console.log("Add field operation");
      setModalVisible(true);
    } else if (operation === "edit-field") {
      // Perform edit field operation
      console.log("Edit field operation");
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handlePress} activeOpacity={0.8}>
          <Text style={styles.submitText}>{operation ? operationTranslations[operation]: "Submit"}</Text>
        </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryButton,
    borderColor: "black",
  },
  submitText: {
    fontSize: 20,
    color: "white",
    fontWeight: "800",
  }
});
