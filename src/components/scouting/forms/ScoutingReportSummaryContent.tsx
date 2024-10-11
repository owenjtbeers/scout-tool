import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import {
  Button,
  Dialog,
  FAB,
  Input,
  ListItem,
  Text,
  useTheme,
} from "@rneui/themed";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { ScrollView, View, InputAccessoryView, Platform } from "react-native";
import { DatePickerInput } from "react-native-paper-dates";
import { useDispatch } from "react-redux";
import { Field } from "../../../redux/fields/types";
import { drawingSlice } from "../../../redux/map/drawingSlice";
import {
  useCreateScoutingReportMutation,
  useUpdateScoutingReportMutation,
} from "../../../redux/scouting/scoutingApi";
import { useGetCurrentUserQuery } from "../../../redux/user/userApi";
import DisplayScoutingImages from "../camera/DisplayScoutingImages";
import type { ScoutingReportForm } from "../types";
import { getAliasSummaryText } from "../utils/scoutReportFormatting";
import {
  getAliasesMapForScoutingAreas,
  getNumberOfObservationsFromScoutingArea,
} from "../utils/scoutReportUtils";
import { scoutFormStyles } from "./styles";
import { DialogPickerSelect } from "../../../forms/components/DialogPicker";

interface ScoutingReportSummaryContentProps {
  field: Field;
  formControl: Control<ScoutingReportForm>;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
  formSetValue: UseFormSetValue<ScoutingReportForm>;
  watch: UseFormWatch<ScoutingReportForm>;
  setSelectedScoutingAreaIndex: (index: number) => void;
  setSideSheetContentType: (contentType: "summary" | "observation") => void;
  setIsDrawingScoutingArea: (isDrawing: boolean) => void;
  setIsDoneWithReport: (isDone: boolean) => void;
}
export const ScoutingReportSummaryContent = (
  props: ScoutingReportSummaryContentProps
) => {
  const {
    field,
    formControl,
    formGetValues,
    watch,
    setSelectedScoutingAreaIndex,
    setSideSheetContentType,
    setIsDrawingScoutingArea,
    setIsDoneWithReport,
    formSetValue,
  } = props;
  const { data: currentUserResponse } = useGetCurrentUserQuery("default");
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const [createScoutingReport, createResult] =
    useCreateScoutingReportMutation();
  const [updateScoutReport, updateResult] = useUpdateScoutingReportMutation();
  const [isScoutedAreaDialogOpen, setIsScoutedAreaDialogOpen] = useState(false);
  const [isViewingPhotos, setIsViewingPhotos] = useState(false);

  const scoutingAreas = watch("scoutingAreas");
  const aliasMap = getAliasesMapForScoutingAreas(scoutingAreas);

  const getCropOptions = () => {
    const selectedField = formGetValues("field");
    const fieldCropNames = selectedField?.FieldCrops?.map((fieldCrop) => {
      return fieldCrop.Crop.Name;
    });
    const currentCropName = formGetValues("crop.Name");
    if (currentCropName && currentCropName !== "") {
      fieldCropNames.push(currentCropName);
    }
    // Remove duplicates
    const uniqueFieldCropNames = Array.from(new Set(fieldCropNames));
    return uniqueFieldCropNames.map((cropName) => {
      return {
        label: cropName,
        value: cropName,
      };
    });
  };
  return (
    <>
      <View
        style={{
          ...scoutFormStyles.floatingScoutButton,
          backgroundColor: theme.colors.primary,
        }}
      >
        <Button
          title={"SCOUT MODE"}
          color={"secondary"}
          titleStyle={{ color: theme.colors.primary }}
          onPress={() => {
            setSideSheetContentType("observation");
            // setIsDrawingScoutingArea(true);
            // TODO: Ensure this is the main area
            setSelectedScoutingAreaIndex(0);
          }}
        />
      </View>
      <ScrollView
        style={{ ...scoutFormStyles.page, backgroundColor: theme.colors.grey0 }}
      >
        <View key={"section-field-info"} style={scoutFormStyles.section}>
          {/* Section for Field information, selected field name, crop info, previous crops, current date */}
          <Text>Field: {field?.Name}</Text>
          <Controller
            control={formControl}
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <>
                  {/* <Button onPress={onBlur} title={value.toDateString()} /> */}
                  <DatePickerInput
                    label="Scouted Date"
                    value={typeof value === "string" ? new Date(value) : value}
                    locale={"en"}
                    inputMode={"end"}
                    withDateFormatInLabel={false}
                    presentationStyle="pageSheet"
                    // date={value}
                    // mode="single"
                    onChange={onChange}
                    style={{ backgroundColor: theme.colors.grey0 }}
                  />
                </>
              );
            }}
            name="scoutedDate"
            rules={{ required: true }}
            defaultValue={new Date()}
          />
          <Controller
            control={formControl}
            name="fieldArea"
            defaultValue={0}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Input
                label={`Field Area (${
                  formGetValues("fieldAreaUnit") || "acres"
                })`}
                placeholder={"Enter Area"}
                keyboardType={"numeric"}
                onChangeText={(value) => {
                  onChange(value.replace(/[^0-9]/g, ""));
                }}
                value={value.toString()}
                errorMessage={error?.message}
                autoCapitalize={"none"}
              />
            )}
          />

          <Controller
            control={formControl}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <DialogPickerSelect
                label={"Crop"}
                options={getCropOptions()}
                onChangeText={onChange}
                value={value}
                onAddNewOption={(value: string) => {
                  onChange(value);
                }}
                errorMessage={error?.message}
                style={{ height: 250 }}
                inputStyle={{ maxHeight: 50 }}
              />
            )}
            name="crop.Name"
            rules={{
              required: "Crop Name is required",
              minLength: {
                value: 3,
                message: "Must be at least three characters",
              },
            }}
            defaultValue=""
          />
          <Controller
            control={formControl}
            render={({ field: { onChange, onBlur, value, name } }) => (
              <>
                <Input
                  placeholder="Enter Growth Stage..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  label={"Growth Stage"}
                  inputAccessoryViewID={name}
                  // style={scoutFormStyles.largeTextInput}
                />
                {Platform.OS === "ios" && (
                  <InputAccessoryView nativeID={name}>
                    <Input
                      placeholder="Enter Growth Stage..."
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      label={"Growth Stage"}
                    />
                  </InputAccessoryView>
                )}
              </>
            )}
            name="growthStage"
            rules={{ required: false }}
            defaultValue=""
          />
        </View>
        <View
          key={"section-scouting-object-summary"}
          style={scoutFormStyles.section}
        >
          <View style={scoutFormStyles.summaryRow}>
            <FontAwesome5 name="binoculars" size={24} />
            <Text># of Scouted Areas</Text>
            <FAB>
              <Text style={scoutFormStyles.buttonText}>
                {formGetValues("scoutingAreas")?.length}
              </Text>
            </FAB>

            <Dialog
              isVisible={isScoutedAreaDialogOpen}
              onBackdropPress={() => setIsScoutedAreaDialogOpen(false)}
            >
              <Dialog.Title
                title={"Select a Scouting Area to View/Edit it's observations"}
              ></Dialog.Title>
              {scoutingAreas.map((scoutingArea, index) => (
                <ListItem
                  onPress={() => {
                    setSelectedScoutingAreaIndex(index);
                    setSideSheetContentType("observation");
                  }}
                  key={scoutingArea.UId}
                >
                  <ListItem.Title>{scoutingArea.UId}</ListItem.Title>
                  <ListItem.Subtitle>
                    {getNumberOfObservationsFromScoutingArea(scoutingArea)}{" "}
                    Observations
                  </ListItem.Subtitle>
                </ListItem>
              ))}
            </Dialog>
          </View>
          {formGetValues("scoutingAreas")?.length ? (
            <Button
              title={"View Scouted Areas"}
              buttonStyle={{ paddingTop: 10 }}
              onPress={() => setIsScoutedAreaDialogOpen(true)}
            />
          ) : null}
          <View style={scoutFormStyles.summaryRow}>
            <Entypo name="magnifying-glass" size={24} />
            <Text># of Observations</Text>
            <FAB>
              <Text style={scoutFormStyles.buttonText}>
                {scoutingAreas.reduce((acc, scoutingArea) => {
                  return (
                    acc + getNumberOfObservationsFromScoutingArea(scoutingArea)
                  );
                }, 0)}
              </Text>
            </FAB>
          </View>
          <View style={scoutFormStyles.summaryRow}>
            <FontAwesome5 name="camera" size={24} />
            <Text># of Images</Text>
            <FAB>
              <Text style={scoutFormStyles.buttonText}>
                {formGetValues("images")?.length}
              </Text>
            </FAB>
          </View>
          {formGetValues("images")?.length ? (
            <Button
              title={"View Images"}
              onPress={() => setIsViewingPhotos(!isViewingPhotos)}
            />
          ) : null}
          {isViewingPhotos ? (
            <DisplayScoutingImages
              onClose={() => setIsViewingPhotos(false)}
              formGetValues={formGetValues}
              formSetValue={formSetValue}
              scoutingImages={formGetValues("images")}
            />
          ) : null}
        </View>
        {Object.keys(aliasMap.Weeds).length ||
        Object.keys(aliasMap.Diseases).length ||
        Object.keys(aliasMap.Insects).length ||
        Object.keys(aliasMap.General).length ? (
          <View
            key={"section-auto-generated-summary"}
            style={scoutFormStyles.section}
          >
            {summaryListForAliases(aliasMap.Weeds)}
            {summaryListForAliases(aliasMap.Diseases)}
            {summaryListForAliases(aliasMap.Insects)}
            {summaryListForAliases(aliasMap.General)}
          </View>
        ) : null}
        <View
          key={"section-summary-text-input"}
          style={scoutFormStyles.section}
        >
          <Controller
            control={formControl}
            render={({ field: { onChange, onBlur, value, name } }) => (
              <>
                <Input
                  placeholder="Summary here..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  label={"Comments"}
                  multiline
                  inputAccessoryViewID={name}
                  style={scoutFormStyles.largeTextInput}
                />
                {Platform.OS === "ios" && (
                  <InputAccessoryView nativeID={name}>
                    <Input
                      value={value}
                      placeholder="Summary here..."
                      onBlur={onBlur}
                      onChangeText={onChange}
                      label={"Comments"}
                      multiline
                      style={scoutFormStyles.largeTextInput}
                    />
                  </InputAccessoryView>
                )}
              </>
            )}
            name="summaryText"
            rules={{ required: false }}
            defaultValue=""
          />
        </View>
        <View key={"section-recommendations"} style={scoutFormStyles.section}>
          <Controller
            control={formControl}
            render={({ field: { onChange, onBlur, value, name } }) => (
              <>
                <Input
                  placeholder="Specify recommendation text here..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  label={"Recommendations"}
                  multiline
                  inputAccessoryViewID={name}
                  style={scoutFormStyles.largeTextInput}
                />
                {Platform.OS === "ios" && (
                  <InputAccessoryView nativeID={name}>
                    <Input
                      placeholder="Specify recommendation text here..."
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      label={"Recommendations"}
                      multiline
                      style={scoutFormStyles.largeTextInput}
                    />
                  </InputAccessoryView>
                )}
              </>
            )}
            name="recommendations"
            rules={{ required: false }}
            defaultValue=""
          />
        </View>
        <Button
          title={"FINISH SCOUTING REPORT"}
          onPress={() => setIsDoneWithReport(true)}
          loading={createResult.isLoading || updateResult.isLoading}
        />
        <View key={"paddingBottomScrollView"} style={{ height: 50 }} />
      </ScrollView>
    </>
  );
};

const summaryListForAliases = (mapObject: { [key: string]: Set<string> }) => {
  return Object.keys(mapObject).map((alias) => {
    const areas = mapObject[alias];
    const areaString = Array.from(areas).join(", ");
    return (
      <Text key={alias}>
        {getAliasSummaryText(alias, areas.size, areaString)}
      </Text>
    );
  });
};
