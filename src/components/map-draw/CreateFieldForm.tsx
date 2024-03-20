import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { View, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { BottomSheet, Button, Input } from "@rneui/themed";
import { useForm, Controller } from "react-hook-form";
import { FeatureCollection, Units } from "@turf/helpers";
import { Ionicons } from "@expo/vector-icons";
import { RNMapsPolygonArea, FeatureCollectionArea } from "../../utils/area";
import { validationRules } from "../../forms/validationRules";
import { validation } from "../../forms/validationFunctions";
import { useCreateFieldMutation } from "../../redux/fields/fieldsApi";
import { Field } from "../../redux/fields/types";
import { useSelectedGrowerAndFarm } from "../layout/topBar/selectionHooks";
import { convertRNMapsPolygonToTurfFeatureCollection } from "../../utils/latLngConversions";
import { useRouter } from "expo-router";
import { useGetFarmsQuery } from "../../redux/field-management/fieldManagementApi";
import { HOME_MAP_SCREEN } from "../../navigation/screens";
import { CustomDialogPicker } from "../../forms/components/DialogPicker";
import { Href } from "expo-router";

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

  const polygon = useSelector(
    (state: RootState) => state["map-drawing"].polygon
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
      fc = convertRNMapsPolygonToTurfFeatureCollection(polygon);
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
      router.push(HOME_MAP_SCREEN as Href<string>);
    } else if ("error" in response) {
      // Error Modal on page?
      console.log(response.error);
    }
  };

  const getPolygonArea = useCallback(() => {
    if (tempGeoJSON !== null) {
      return FeatureCollectionArea(tempGeoJSON, areaUnit, 3);
    }
    return RNMapsPolygonArea(polygon, areaUnit, 3);
  }, [polygon, tempGeoJSON]);

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
                      <CustomDialogPicker
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
                        errorMessage={error?.message}
                      />
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
                    <Input
                      placeholder="Legal Description"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      label={"Legal Description"}
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
                    <CustomDialogPicker
                      options={cropOptions.map((crop) => ({
                        label: crop,
                        value: crop,
                      }))}
                      value={value}
                      onChangeText={onChange}
                      label="Crop"
                      errorMessage={error?.message}
                    />
                  )}
                  name="crop"
                  defaultValue=""
                />
              </View>
              <View>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => {
                    const calculatedArea = getPolygonArea();
                    return (
                      <Input
                        label={`Area in ${areaUnit} (optional) `}
                        placeholder="Area"
                        defaultValue={calculatedArea?.toString()}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={
                          value === undefined
                            ? calculatedArea?.toString()
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
    paddingLeft: 15,
  },
  pickerStyle: {
    paddingLeft: 10,
  },
});
