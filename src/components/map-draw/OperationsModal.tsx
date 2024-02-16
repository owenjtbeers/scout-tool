import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import type { Units } from "@turf/helpers";
import { RNMapsPolygonArea } from "../../utils/area";
import { validationRules } from "../../forms/validationRules";
import { validation } from "../../forms/validationFunctions";
import { ErrorMessage } from "../../forms/components/ErrorMessage";

type FieldFormData = {
  name: string;
  legalDescription: string;
  crop: string;
  area?: number;
};

type OperationsModalProps = {
  visible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

// TODO: Fetch these or grab these from state
const cropOptions = ["Wheat", "Potato", "Winter Wheat", "Corn", "Barley"];
const units = ["acres", "hectares"] as Units[];

export const OperationsModal: React.FC<OperationsModalProps> = ({
  visible,
  setModalVisible,
}) => {
  const { control, handleSubmit } = useForm<FieldFormData>();

  const [areaUnit, setAreaUnit] = useState(units[0]);
  const polygon = useSelector(
    (state: RootState) => state["map-drawing"].polygon
  );

  const onClose = () => {
    setModalVisible(false);
  };
  const testPress = (event: any) => {
    console.log(event);
  };

  const onSubmit = (data: FieldFormData) => {
    // Handle form submission here
    console.log(data);
    onClose();
  };

  const onError = (errors: any) => {
    console.log(errors);
  };

  return (
    // TODO Make this play nice with the keyboard
    <View style={styles.centeredView}>
      <Modal
        visible={visible}
        onRequestClose={onClose}
        animationType="slide"
        // presentationStyle="fullScreen"
        transparent={true}
        statusBarTranslucent
      >
        <View style={styles.modalView}>
          <View style={styles.formBackground}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close-sharp" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.formView}>
              <View>
                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <Text style={styles.inputTitleText}>Field Name</Text>
                      {error && <ErrorMessage style={styles.errorMessage} message={error.message} />}
                      <TextInput
                        placeholder="Field Name"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={styles.input}
                      />
                    </>
                  )}
                  name="name"
                  rules={validationRules.requiredAndMinMaxLength(1, 100)}
                  defaultValue=""
                />
              </View>
              <View>
                <Text style={styles.inputTitleText}>Legal Description</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Legal Description"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={styles.input}
                    />
                  )}
                  name="legalDescription"
                  rules={{ required: false }}
                  defaultValue=""
                />
              </View>
              <View>
                <Controller
                  control={control}
                  rules={{validate: validation.isNotPlaceholderValue("")}}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <>
                      <Text style={styles.inputTitleText}>Crop</Text>
                      {error && <ErrorMessage style={styles.errorMessage} message={error.message} />}
                      <View style={styles.input}>
                        <Picker
                          selectedValue={value}
                          onValueChange={onChange}
                          onBlur={onBlur}
                        >
                          <Picker.Item label="Choose a Crop" value="" />
                          {cropOptions.map((crop, index) => (
                            <Picker.Item
                              key={index}
                              label={crop}
                              value={crop}
                            />
                          ))}
                        </Picker>
                      </View>
                    </>
                  )}
                  name="crop"
                  defaultValue=""
                />
              </View>
              <View>
                <Text style={styles.inputTitleText}>
                  {`Area in ${areaUnit} (optional)`}{" "}
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Area"
                      defaultValue={RNMapsPolygonArea(
                        polygon,
                        areaUnit,
                        3
                      ).toString()}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value === undefined ? "" : value.toString()}
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  )}
                  name="area"
                />
              </View>
              <Pressable style={styles.button} onPress={testPress}>
                <Button
                  title="Create New Field"
                  onPress={handleSubmit(onSubmit, onError)}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  }
});
