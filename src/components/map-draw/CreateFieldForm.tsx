import { Ionicons } from "@expo/vector-icons";
import { BottomSheet, Button, Input } from "@rneui/themed";
import { FeatureCollection, Units } from "@turf/helpers";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  InputAccessoryView,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { DialogPickerSelect } from "../../forms/components/DialogPicker";
import { validation } from "../../forms/validationFunctions";
import { validationRules } from "../../forms/validationRules";
import { HOME_MAP_SCREEN } from "../../navigation/screens";
import { useGetFarmsQuery } from "../../redux/field-management/fieldManagementApi";
import { useCreateFieldMutation } from "../../redux/fields/fieldsApi";
import { Field } from "../../redux/fields/types";
import { RootState } from "../../redux/store";
import { FeatureCollectionArea, RNMapsPolygonArea } from "../../utils/area";
import { convertRNMapsPolygonToTurfFeatureCollection } from "../../utils/latLngConversions";
import { useSelectedGrowerAndFarm } from "../layout/topBar/selectionHooks";

type FieldFormProps = {
  isVisible: boolean;
  setIsVisible: (val: boolean) => void;
  areaUnit: Units;
};

type FieldFormData = {
  growerId: string;
  farmId: string;
  name: string;
  legalDescription: string;
  crop: string;
  area?: number;
  geojson: FeatureCollection;
};

// TODO: Fetch these or grab these from state
const cropOptions = ["Wheat", "Potato", "Winter Wheat", "Corn", "Barley"];

export function CreateFieldForm(props: FieldFormProps) {
  const { isVisible, setIsVisible, areaUnit } = props;
  const router = useRouter();
  const { control, handleSubmit } = useForm<FieldFormData>();

  const [createField] = useCreateFieldMutation();

  const polygons = useSelector(
    (state: RootState) => state["map-drawing"].polygons
  );
  const tempGeoJSON = useSelector(
    (state: RootState) => state["map-drawing"].tempGeoJSON
  );
  const { data: masterFarmsList } = useGetFarmsQuery("default");

  const { selectedGrower } = useSelectedGrowerAndFarm();

  const onSubmit = async (data: FieldFormData) => {
    let fc: FeatureCollection;
    if (tempGeoJSON !== null) {
      fc = tempGeoJSON;
    } else {
      fc = convertRNMapsPolygonToTurfFeatureCollection(polygons[0]);
    }
    const fieldData = {
      Name: data.name,
      GrowerId: selectedGrower?.ID,
      FarmId: Number(data.farmId),
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

  const getPolygonArea = useCallback(() => {
    if (tempGeoJSON !== null) {
      return FeatureCollectionArea(tempGeoJSON, areaUnit, 3);
    }
    return RNMapsPolygonArea(polygons[0], areaUnit, 3);
  }, [polygons, tempGeoJSON]);

  const onError = (errors: any) => {
    console.log(errors);
  };

  const onClose = () => {
    setIsVisible(false);
  };

  const farmsOfSelectedGrower = masterFarmsList?.filter(
    (farm) => farm.GrowerId === selectedGrower?.ID
  );
  return (
    <View>
      <BottomSheet
        isVisible={isVisible}
        onBackdropPress={onClose}
        modalProps={{
          statusBarTranslucent: true,
          // transparent: true,
          animationType: "slide",
          presentationStyle: "fullScreen",
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
                <Input
                  placeholder="Grower"
                  value={selectedGrower?.Name}
                  style={styles.input}
                  label="Grower"
                  disabled
                />
              </View>
              <View>
                <Controller
                  control={control}
                  rules={{
                    validate: validation.isNotPlaceholderValue(undefined),
                  }}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <DialogPickerSelect
                        options={farmsOfSelectedGrower?.map((farm) => ({
                          label: farm.Name,
                          value: farm.ID.toString(),
                        }))}
                        value={value?.toString()}
                        onChangeText={onChange}
                        label="Farm"
                        errorMessage={error?.message}
                        dialogTitle="Select a Farm"
                      />
                    </>
                  )}
                  name="farmId"
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
                      <Input
                        label="Field Name"
                        placeholder="Field Name"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        inputAccessoryViewID="fieldname"
                        errorMessage={error?.message}
                      />
                      {Platform.OS === "ios" && (
                        <InputAccessoryView nativeID={"fieldname"}>
                          <Input
                            label="Field Name"
                            placeholder="Field Name"
                            value={value}
                            style={styles.input}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            errorMessage={error?.message}
                          />
                        </InputAccessoryView>
                      )}
                    </>
                  )}
                  name="name"
                  rules={validationRules.requiredAndMinMaxLength(1, 100)}
                  defaultValue=""
                />
              </View>
              <View>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <Input
                        placeholder="Legal Description"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        label={"Legal Description"}
                        inputAccessoryViewID="legaldescription"
                      />
                      {Platform.OS === "ios" && (
                        <InputAccessoryView nativeID={"legaldescription"}>
                          <Input
                            placeholder="Legal Description"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            label={"Legal Description"}
                            style={styles.input}
                          />
                        </InputAccessoryView>
                      )}
                    </>
                  )}
                  name="legalDescription"
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
    paddingLeft: 15,
  },
  pickerStyle: {
    paddingLeft: 10,
  },
});
