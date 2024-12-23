import React, { useRef } from "react";

// Components
import { ActivityIndicator, StyleSheet, View, ScrollView } from "react-native";
import { Button, useTheme, Text, Dialog, ListItem, Input } from "@rneui/themed";
import { FieldUploadTabIcon } from "../layout/bottomBar/BottomButtons";
import { MaterialIcons } from "@expo/vector-icons";
import { GeoJsonSVG } from "../geojson/GeoJsonSVG";
import { InputWithAccessoryView } from "../lib/InputWithAccessoryView";

// Libraries
import { useForm, Controller, useWatch, set } from "react-hook-form";
import shp from "shpjs";
import { FeatureCollectionArea } from "../../utils/area";
import { ErrorMessage } from "../../forms/components/ErrorMessage";
import { Field } from "../../redux/fields/types";
import {
  useGetGrowersQuery,
  useGetFarmsQuery,
} from "../../redux/field-management/fieldManagementApi";
import { useCreateFieldMutation } from "../../redux/fields/fieldsApi";
import { DialogPickerSelect } from "../../forms/components/DialogPicker";

const FieldUploadContainer: React.FC = () => {
  const { theme } = useTheme();
  const [file, setFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fileEntries, setFileEntries] = React.useState<
    shp.FeatureCollectionWithFilename[] | null
  >(null);
  const [isAssociatingFieldsToGrowers, setIsAssociatingFieldsToGrowers] =
    React.useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      // Clear file entries
      setFileEntries(null);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setIsLoading(true);
    try {
      if (file) {
        // Handle the file upload logic here
        setFile(file);
        // Parse the file here
        const data = await file.arrayBuffer();
        let geojson = await shp.parseZip(data);
        if (!Array.isArray(geojson)) {
          geojson = [geojson];
        }
        console.log(geojson);
        setFileEntries(geojson);
        setIsLoading(false);
        // Determine Contents
        // If file contains at least one valid .shp and .dbf file proceed to the next step and log errors
        // If file contains no valid .shp and .dbf files, log errors
      }
    } catch (e) {
      console.error(e);
    } finally {
      // setIsLoading(false);
      fileInputRef.current!.value = "";
    }
  };

  return (
    <View style={styles.container}>
      <Dialog
        isVisible={
          isLoading || (fileEntries !== null && !isAssociatingFieldsToGrowers)
        }
        onDismiss={() => setIsLoading(false)}
      >
        <View style={styles.dialogContentContainer}>
          <Dialog.Title
            titleStyle={{ color: theme.colors.primary }}
            title={"Processing Field Boundaries"}
          ></Dialog.Title>

          {isLoading ? (
            <ActivityIndicator
              animating={isLoading}
              size="large"
              color={theme.colors.primary}
            />
          ) : (
            <Text>{`(${fileEntries?.length}) Shape Files detected`}</Text>
          )}
          <ListItem
            containerStyle={styles.listItemParsed}
            style={{ width: "100%" }}
          >
            <Text>{"Filename"}</Text>
            <Text>{"Estimated Area"}</Text>
            <Text>{"Preview"}</Text>
          </ListItem>
          <ScrollView style={styles.scrollViewContent}>
            {fileEntries?.length &&
              fileEntries.map((entry, index) => (
                <View key={index}>
                  <ListItem key={index} containerStyle={styles.listItemParsed}>
                    <Text>{entry.fileName}</Text>
                    <Text>{`${FeatureCollectionArea(
                      entry,
                      "acres",
                      0
                    )} ac`}</Text>
                    <GeoJsonSVG geojson={entry} width={100} height={100} />
                  </ListItem>
                  {entry.features.length && entry.features.length > 5 && (
                    <ErrorMessage
                      message={
                        "** More than 4 features detected, this file may contain more than one field **"
                      }
                    />
                  )}
                </View>
              ))}
          </ScrollView>
          <View style={styles.buttonGroup}>
            <Button
              title="Cancel"
              onPress={() => {
                setIsLoading(false);
                setFileEntries(null);
              }}
            />
            <Button
              title="Continue"
              onPress={() => {
                setIsLoading(false);
                setIsAssociatingFieldsToGrowers(true);
              }}
            />
          </View>
        </View>
      </Dialog>
      <Dialog
        isVisible={isAssociatingFieldsToGrowers}
        onDismiss={() => setIsAssociatingFieldsToGrowers(false)}
      >
        <View style={styles.dialogContentContainer}>
          <Dialog.Title
            titleStyle={{ color: theme.colors.primary }}
            title={"Associate Fields to Growers"}
          ></Dialog.Title>
          <Text>{"Select a Grower and Farm to associate the fields to"}</Text>
          <BulkFieldCreationForm entries={fileEntries || []} />
          <View style={styles.buttonGroup}>
            <Button
              title="Back"
              onPress={() => {
                setIsAssociatingFieldsToGrowers(false);
              }}
            />
            <Button
              title="Continue"
              onPress={() => {
                //
                setIsAssociatingFieldsToGrowers(false);
              }}
            />
          </View>
        </View>
      </Dialog>
      <FieldUploadTabIcon
        focused={false}
        color={theme.colors.primary}
        size={50}
      />
      <Text h3 style={{ color: theme.colors.primary }}>
        Upload Field Boundaries
      </Text>
      <View style={styles.infoTextContainer}>
        <Text style={{ color: theme.colors.primary }}>
          Upload a ZIP file containing your field boundaries.{" "}
        </Text>
        <Text style={{ color: theme.colors.primary }}>
          This tool expects .shp and .dbf files with the same filename
        </Text>
      </View>
      <Button
        radius={10}
        raised
        title="Select ZIP File"
        onPress={handleButtonClick}
        icon={
          <MaterialIcons
            name="file-upload"
            color={theme.colors.secondary}
            size={24}
          />
        }
      />
      <View style={styles.infoTextContainer}>
        <Text style={{ color: theme.colors.primary }}>
          After successfull parsing, you will be asked to associate the
          boundaries to a Grower and Farm.
        </Text>
        <Text>Updating existing boundaries or creating a new field</Text>
      </View>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".zip"
        onChange={handleFileChange}
      />
    </View>
  );
};

interface BulkFieldCreationForm {
  newFields: Field[];
}
const BulkFieldCreationForm = (props: {
  entries: shp.FeatureCollectionWithFilename[];
}) => {
  const { entries } = props;
  const { data: growerData } = useGetGrowersQuery("default");
  const { data: farmData } = useGetFarmsQuery("default");
  const [createFields] = useCreateFieldMutation();
  const [isSyncingFieldsWithServer, setIsSyncingFieldsWithServer] =
    React.useState(false);
  const [createFieldResults, setCreateFieldResults] = React.useState<
    { name: string; status: string }[]
  >([]);

  const defaultFormValues: BulkFieldCreationForm = {
    newFields: entries.map((entry) => ({
      ID: 0,
      Grower: null,
      GrowerId: 0,
      Farm: null,
      FarmId: 0,
      Name: entry.fileName || "",
      ActiveCrop: null,
      FieldCrops: [],
      ActiveBoundary: { Json: entry, Boundary: null },
    })),
  };
  const { control, handleSubmit, getValues } = useForm<BulkFieldCreationForm>({
    defaultValues: defaultFormValues,
  });

  const onSubmit = (data: BulkFieldCreationForm) => {
    setIsSyncingFieldsWithServer(true);
    try {
      const results = data.newFields.map((field) => ({
        name: field.Name,
        status: "Pending",
      }));
      data.newFields.forEach(async (field, index) => {
        const response = await createFields(field);
        if ("data" in response) {
          results[index] = { name: field.Name, status: "Success" };
        } else {
          results[index] = { name: field.Name, status: "Failed" };
        }
        setCreateFieldResults(results);
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncingFieldsWithServer(false);
    }
  };

  return (
    <ScrollView style={styles.scrollViewContent}>
      {isSyncingFieldsWithServer && (
        <>
          <ActivityIndicator size="large" color="blue" />
          <Text>{"Syncing Fields with Server"}</Text>
          <Text>{`Total ${createFieldResults.length}`}</Text>
          <Text>{`${
            createFieldResults.filter((result) => result.status !== "Success")
              .length
          } Success`}</Text>
          <Text>{`${
            createFieldResults.filter((result) => result.status !== "Failed")
              .length
          } Failed`}</Text>
          <Text>{`${
            createFieldResults.filter((result) => result.status !== "Pending")
              .length
          } Pending`}</Text>
        </>
      )}
      {!isSyncingFieldsWithServer &&
        getValues("newFields").map((newField, index) => {
          const geojson = newField.ActiveBoundary?.Json;
          return (
            <ListItem key={index} style={styles.listItemParsed}>
              <View style={styles.doubleInputContainer}>
                <Controller
                  control={control}
                  name={`newFields.${index}.FarmId`}
                  rules={{
                    min: { value: 1, message: "** Farm is required" },
                  }}
                  render={({ field: farmField, fieldState }) => {
                    useWatch({
                      control,
                      name: `newFields.${index}.GrowerId`,
                    });
                    const filteredFarmData = farmData?.filter((farm) => {
                      return (
                        farm.GrowerId ===
                        getValues(`newFields.${index}.GrowerId`)
                      );
                    });
                    return (
                      <>
                        <DialogPickerSelect
                          label="Farm"
                          onChangeText={(value: string) =>
                            farmField.onChange(Number(value))
                          }
                          value={String(farmField.value)}
                          errorMessage={fieldState.error?.message}
                          containerStyle={styles.inputSelectorStyle}
                          inputStyle={styles.inputSelectorStyle}
                          inputContainerStyle={styles.inputSelectorStyle}
                          options={
                            filteredFarmData?.map((farm) => {
                              return {
                                label: farm.Name,
                                value: String(farm.ID),
                              };
                            }) || []
                          }
                        />
                        <Controller
                          control={control}
                          name={`newFields.${index}.GrowerId`}
                          rules={{
                            min: { value: 1, message: "** Grower is required" },
                          }}
                          render={({ field: growerField, fieldState }) => {
                            return (
                              <DialogPickerSelect
                                label="Grower"
                                options={growerData?.map((grower) => {
                                  return {
                                    label: grower.Name,
                                    value: String(grower.ID),
                                  };
                                })}
                                onChangeText={(value: string) => {
                                  const filteredFarmData = farmData?.filter(
                                    (farm) => {
                                      return farm.GrowerId === Number(value);
                                    }
                                  );
                                  growerField.onChange(Number(value));
                                  if (filteredFarmData?.length === 1) {
                                    farmField.onChange(filteredFarmData[0].ID);
                                  } else {
                                    farmField.onChange(0);
                                  }
                                }}
                                value={String(growerField.value)}
                                errorMessage={fieldState.error?.message}
                                containerStyle={styles.inputSelectorStyle}
                                inputStyle={styles.inputSelectorStyle}
                                inputContainerStyle={styles.inputSelectorStyle}
                              />
                            );
                          }}
                        />
                      </>
                    );
                  }}
                />
              </View>
              <View style={styles.inputContainerStyle}>
                <Controller
                  control={control}
                  name={`newFields.${index}.Name`}
                  rules={{
                    minLength: {
                      value: 1,
                      message: "** Field Name is required",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter Field Name"
                      label="Field Name"
                      inputContainerStyle={styles.inputSelectorStyle}
                      inputStyle={styles.inputSelectorStyle}
                    />
                  )}
                />
              </View>
              {geojson && (
                // @ts-expect-error geojson type error
                <GeoJsonSVG geojson={geojson} width={75} height={75} />
              )}
              <Text>{`${FeatureCollectionArea(
                newField.ActiveBoundary?.Json,
                "acres",
                0
              )} ac`}</Text>
            </ListItem>
          );
        })}
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  infoTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  dialogContentContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 20,
  },
  listItemParsed: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    gap: 20,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  growerAndFarmContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  scrollViewContent: {
    maxHeight: 500,
    width: "100%",
  },
  doubleInputContainer: {
    justifyContent: "space-between",
    flexDirection: "column-reverse",
    flex: 1,
  },
  inputContainerStyle: {
    // width: "20%",
  },
  inputSelectorStyle: {
    // Note: this seems to do some magic and allows widths to work
    // maxWidth: 155,
  },
});
export default FieldUploadContainer;
