import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { View, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { BottomSheet, Text, Button, Input } from "@rneui/themed";
import { useForm, Controller } from "react-hook-form";
import { FeatureCollection, Units } from "@turf/helpers";
import { Ionicons } from "@expo/vector-icons";
import { RNMapsPolygonArea } from "../../utils/area";
import { validationRules } from "../../forms/validationRules";
import { validation } from "../../forms/validationFunctions";
import { ErrorMessage } from "../../forms/components/ErrorMessage";
import { Picker } from "@react-native-picker/picker";
import { useCreateFieldMutation } from "../../redux/fields/fieldsApi";
import { Field } from "../../redux/fields/types";
import { useSelectedGrowerAndFarm } from "../layout/topBar/selectionHooks";
import { convertRNMapsPolygonToTurfFeatureCollection } from "../../utils/latLngConversions";
import { Href, useRouter } from "expo-router";
import { HOME_MAP_SCREEN } from "../../navigation/screens";

type FieldFormProps = {
  isVisible: boolean;
  setIsVisible: (val: boolean) => void;
  areaUnit: Units;
};

type FieldFormData = {
  name: string;
  legalDescription: string;
  crop: string;
  area?: number;
  geojson: FeatureCollection;
};

// TODO: Fetch these or grab these from state
const cropOptions = ["Wheat", "Potato", "Winter Wheat", "Corn", "Barley"];

export function CreateFieldForm(props: FieldFormProps) {
  const { control, handleSubmit } = useForm<FieldFormData>();
  const router = useRouter();
  const { isVisible, setIsVisible, areaUnit } = props;
  const [createField] = useCreateFieldMutation();
  const onClose = () => {
    setIsVisible(false);
  };
  const polygon = useSelector(
    (state: RootState) => state["map-drawing"].polygon
  );

  const { selectedGrower, selectedFarm } = useSelectedGrowerAndFarm();
  const onSubmit = async (data: FieldFormData) => {
    const fc = convertRNMapsPolygonToTurfFeatureCollection(polygon);
    const fieldData = {
      Name: data.name,
      GrowerId: selectedGrower?.ID,
      FarmId: selectedFarm?.ID,
      // legalDescription: data.legalDescription,
      // crop: data.crop,
      // area: data.area,
      ActiveBoundary: {
        Json: fc,
        Boundary: null,
      },
    } as Partial<Field>;
    const response = await createField(fieldData);
    if ("data" in response) {
      setIsVisible(false);
      router.push(HOME_MAP_SCREEN);
    } else if ("error" in response) {
      // Error Modal on page?
      console.log(response.error);
    }
  };

  const onError = (errors: any) => {
    console.log(errors);
  };

  return (
    <View>
      <BottomSheet
        isVisible={isVisible}
        onBackdropPress={onClose}
        modalProps={{
          statusBarTranslucent: true,
          transparent: true,
          animationType: "slide",
        }}
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
                <Text style={styles.inputTitleText}>Grower</Text>
                <Input
                  placeholder="Grower"
                  value={selectedGrower?.Name}
                  style={styles.input}
                  disabled
                />
              </View>
              <View>
                <Text style={styles.inputTitleText}>Farm</Text>
                <Input
                  placeholder="Farm"
                  value={selectedFarm?.Name}
                  style={styles.input}
                  disabled
                />
              </View>
              <View>
                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <Text style={styles.inputTitleText}>Field Name</Text>
                      {error && (
                        <ErrorMessage
                          style={styles.errorMessage}
                          message={error.message}
                        />
                      )}
                      <Input
                        placeholder="Field Name"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
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
                    <Input
                      placeholder="Legal Description"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
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
                  rules={{ validate: validation.isNotPlaceholderValue("") }}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <Text style={styles.inputTitleText}>Crop</Text>
                      {error && (
                        <ErrorMessage
                          style={styles.errorMessage}
                          message={error.message}
                        />
                      )}
                      <View>
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
                  render={({ field: { onChange, onBlur, value } }) => {
                    const area = RNMapsPolygonArea(polygon, areaUnit, 3);
                    return (
                      <Input
                        placeholder="Area"
                        defaultValue={area?.toString()}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={
                          value === undefined
                            ? area?.toString()
                            : value.toString()
                        }
                        keyboardType="numeric"
                      />
                    );
                  }}
                  name="area"
                />
              </View>
              <Pressable style={styles.button}>
                <Button
                  title="Create New Field"
                  onPress={handleSubmit(onSubmit, onError)}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

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
