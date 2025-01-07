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


/*
  Container for uploading field boundaries
  Process is as follows:
  1. Select a file
  2. Parse the file, display loading indicator
  3. Display the contents and await user confirmation to proceed
  4. Spawn form and associate the fields to a grower and farm
  5. Submit the fields to the server
  6. Display the results of the submission
*/
const FieldUploadContainer: React.FC = () => {
  const { theme } = useTheme();
  // Step 1: Select a file
  const [fileEntries, setFileEntries] = React.useState<
    shp.FeatureCollectionWithFilename[] | null
  >(null);
  // Step 2: Parse the file
  const [isParsingFile, setIsParsingFile] = React.useState(false);
  // Step 3: Display the contents and await user confirmation to proceed
  // Step 4: Let Form handle associating fields to growers and farms
  const [isAssociatingFieldsToGrowers, setIsAssociatingFieldsToGrowers] =
    React.useState(false);
  // Step 5: Spawn form and associate the fields to a grower and farm
  const [isSubmittingFields, setIsSubmittingFields] = React.useState(false);


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
    setIsParsingFile(true);
    try {
      if (file) {
        // Parse the file here
        const data = await file.arrayBuffer();
        let geojson = await shp.parseZip(data);
        if (!Array.isArray(geojson)) {
          geojson = [geojson];
        }
        setFileEntries(geojson);
        setIsParsingFile(false);
        // Determine Contents
        // If file contains at least one valid .shp and .dbf file proceed to the next step and log errors
        // If file contains no valid .shp and .dbf files, log errors
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsParsingFile(false);
      fileInputRef.current!.value = "";
    }
  };

  return (
    <View style={styles.container}>
      <Dialog
        isVisible={
          isParsingFile || (fileEntries !== null && !isAssociatingFieldsToGrowers)
        }
        onDismiss={() => setIsParsingFile(false)}
      >
        <View style={styles.dialogContentContainer}>
          <Dialog.Title
            titleStyle={{ color: theme.colors.primary }}
            title={"Processing Field Boundaries"}
          ></Dialog.Title>
          {isParsingFile ? (
            <ActivityIndicator
              animating={isParsingFile}
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
                setIsParsingFile(false);
                setFileEntries(null);
              }}
            />
            <Button
              title="Continue to Associate Fields"
              onPress={() => {
                setIsParsingFile(false);
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
          <BulkFieldCreationForm
            entries={fileEntries!}
            onSubmitForm={
              () => {
                setIsSubmittingFields(true);
              }
            }
            onClose={() => {
              // Reset all states
              setIsParsingFile(false);
              setFileEntries(null);
              setIsSubmittingFields(false);
              setIsAssociatingFieldsToGrowers(false);
            }}
          />
          {(!isSubmittingFields) && <View style={styles.buttonGroup}>
            <Button
              title="Back to File Selection"
              onPress={() => {
                setIsAssociatingFieldsToGrowers(false);
              }}
            />
          </View>}
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
export default FieldUploadContainer;
interface BulkFieldCreationForm {
  newFields: Field[];
  onClose?: () => void;
}

/*
  Form that takes actual input from the user for associating 
  fields to growers and farms and handles submission to the server
  displays results of the submission
*/
const BulkFieldCreationForm = (props: {
  entries: shp.FeatureCollectionWithFilename[];
  onClose?: () => void;
  onSubmitForm?: (data: BulkFieldCreationForm) => void;
}) => {
  const { theme } = useTheme();
  const { entries, onClose, onSubmitForm } = props;
  const { data: growerData } = useGetGrowersQuery("default");
  const { data: farmData } = useGetFarmsQuery("default");
  const [createFields] = useCreateFieldMutation();
  const [isSyncingFieldsWithServer, setIsSyncingFieldsWithServer] =
    React.useState(false);
  const [createFieldResults, setCreateFieldResults] = React.useState<
    { name: string; status: string, message?: string }[]
  >([]);

  const defaultFormValues: BulkFieldCreationForm = {
    newFields: entries?.map((entry) => ({
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
    onSubmitForm && onSubmitForm(data);
    try {
      const results = data.newFields?.map<{ name: string, status: string, message?: string }>((field) => ({
        name: field.Name,
        status: "Pending",
      }));
      data.newFields.forEach(async (field, index) => {
        const response = await createFields(field);
        console.log(response);
        if ("data" in response) {
          results[index] = { name: field.Name, status: "Success" };
          console.log(response.data);
        } else {
          // @ts-expect-error error type error
          const message = response.error?.data?.error || ""
          results[index] = { name: field.Name, status: "Failed", message: message };
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
      {(isSyncingFieldsWithServer || createFieldResults.length) ? (
        <>
          {isSyncingFieldsWithServer && <ActivityIndicator size="large" color="blue" />}
          <Dialog.Title title={"Syncing Fields with Server"} />
          <Text h3>{`Total Fields ${createFieldResults.length}`}</Text>
          <Text>{`${createFieldResults.filter((result) => result.status === "Success")
            .length
            } Success`}</Text>
          <Text>{`${createFieldResults.filter((result) => result.status === "Failed")
            .length
            } Failed`}</Text>
          <Text>{`${createFieldResults.filter((result) => result.status === "Pending")
            .length
            } Pending`}</Text>
          <ScrollView style={styles.scrollViewContent}>
            {createFieldResults.filter(result => result.status === "Failed")?.map((result, index) => (
              <ListItem key={index}>
                <Text>{result.name}</Text>
                <Text>{result.status}</Text>
                {result.message && <Text>{result.message}</Text>}
              </ListItem>
            ))}
          </ScrollView>
          <Dialog.Actions>
            <Button title="Close" onPress={() => {
              setCreateFieldResults([])
              onClose && onClose()
            }} />
          </Dialog.Actions>
        </>
      ) : null}
      {!isSyncingFieldsWithServer && !createFieldResults?.length &&
        (<>
          <Dialog.Title
            titleStyle={{ color: theme.colors.primary }}
            title={"Associate Fields to Growers"}
          ></Dialog.Title>
          <Text>{"Select a Grower and Farm to associate the fields to"}</Text>
          {getValues("newFields")?.map((newField, index) => {
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
          <Button
            title="Submit"
            onPress={handleSubmit(onSubmit)}
          />
        </>)}

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

