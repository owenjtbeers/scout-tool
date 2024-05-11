import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Alert } from "react-native";
import { Button, Input, Text, FAB, Dialog, ListItem } from "@rneui/themed";
import { DatePickerInput } from "react-native-paper-dates";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import {
  Controller,
  UseFormHandleSubmit,
  UseFormGetValues,
  Control,
  UseFormWatch,
  set,
} from "react-hook-form";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { drawingSlice } from "../../../redux/map/drawingSlice";
import { scoutFormStyles } from "./styles";
import { Field } from "../../../redux/fields/types";
import type { ScoutingReportForm } from "../types";
import {
  getNumberOfObservationsFromScoutingArea,
  mapFormDataToPostScoutReport,
} from "./scoutReportUtils";
import {
  useCreateScoutingReportMutation,
  useUpdateScoutingReportMutation,
} from "../../../redux/scouting/scoutingApi";
import { useGetCurrentUserQuery } from "../../../redux/user/userApi";

interface ScoutingReportSummaryContentProps {
  field: Field;
  handleSubmit: UseFormHandleSubmit<ScoutingReportForm>;
  formControl: Control<ScoutingReportForm>;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
  watch: UseFormWatch<ScoutingReportForm>;
  setSelectedScoutingAreaIndex: (index: number) => void;
  setSideSheetContentType: (contentType: "summary" | "observation") => void;
  setIsDrawingScoutingArea: (isDrawing: boolean) => void;
}
export const ScoutingReportSummaryContent = (
  props: ScoutingReportSummaryContentProps
) => {
  const {
    field,
    handleSubmit,
    formControl,
    formGetValues,
    watch,
    setSelectedScoutingAreaIndex,
    setSideSheetContentType,
    setIsDrawingScoutingArea,
  } = props;
  const { data: currentUserResponse } = useGetCurrentUserQuery("default");
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const [createScoutingReport, createResult] =
    useCreateScoutingReportMutation();
  const [updateScoutReport, updateResult] = useUpdateScoutingReportMutation();
  const [isScoutedAreaDialogOpen, setIsScoutedAreaDialogOpen] = useState(false);
  const scoutingAreas = watch("scoutingAreas");

  return (
    <>
      <View
        style={{
          ...scoutFormStyles.floatingScoutButton,
          backgroundColor: theme.colors.primary,
        }}
      >
        <Button
          title={"SCOUT AN AREA"}
          color={"secondary"}
          titleStyle={{ color: theme.colors.primary }}
          onPress={() => {
            dispatch(
              drawingSlice.actions.setIsDrawing({
                isDrawing: true,
                drawMode: null,
              })
            );
            dispatch(drawingSlice.actions.clearAllShapes());
            setIsDrawingScoutingArea(true);
            setSelectedScoutingAreaIndex(scoutingAreas.length);
          }}
        />
      </View>
      <ScrollView
        style={{ ...scoutFormStyles.page, backgroundColor: theme.colors.grey0 }}
      >
        <View key={"section-field-info"} style={scoutFormStyles.section}>
          {/* Section for Field information, selected field name, crop info, previous crops, current date */}
          <Text>Field: {field.Name}</Text>
          <Text>
            {/* TODO get this from the field object*/}
            In-season Crop: {"CORN"}
          </Text>
          <Text>
            {/* TODO get this from the field object*/}
            Previous Crops: {"CORN, SOYBEAN"}
          </Text>
          <Controller
            control={formControl}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                {/* <Button onPress={onBlur} title={value.toDateString()} /> */}
                <DatePickerInput
                  label="Scouted Date"
                  value={value}
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
            )}
            name="scoutedDate"
            rules={{ required: true }}
            defaultValue={new Date()}
          />
        </View>
        <View
          key={"section-scouting-object-summary"}
          style={scoutFormStyles.section}
        >
          <View style={scoutFormStyles.summaryRow}>
            <FontAwesome5 name="binoculars" size={24} />
            <Text># of Scouted Areas</Text>
            <FAB onPress={() => setIsScoutedAreaDialogOpen(true)}>
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
        </View>
        <View
          key={"section-summary-text-input"}
          style={scoutFormStyles.section}
        >
          <Controller
            control={formControl}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Summary here..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                label={"Summary"}
                multiline
                style={scoutFormStyles.largeTextInput}
              />
            )}
            name="summaryText"
            rules={{ required: false }}
            defaultValue=""
          />
        </View>
        <View key={"section-recommendations"} style={scoutFormStyles.section}>
          <Controller
            control={formControl}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Recommendation text here..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                label={"Recommendations"}
                multiline
                style={scoutFormStyles.largeTextInput}
              />
            )}
            name="recommendationText"
            rules={{ required: false }}
            defaultValue=""
          />
        </View>
        <Button
          title={"FINISH SCOUTING REPORT"}
          onPress={handleSubmit(async (data) => {
            const postData = mapFormDataToPostScoutReport(
              data,
              currentUserResponse?.data
            );
            console.log(postData);
            let scoutingReportResponse;
            if (!!postData.ID) {
              scoutingReportResponse = await updateScoutReport({
                id: postData.ID,
                data: postData,
              });
            } else {
              scoutingReportResponse = await createScoutingReport(postData);
            }

            if ("error" in scoutingReportResponse) {
              console.error(scoutingReportResponse.error);
            } else {
              Alert.alert(
                "Scouting Report saved successfully",
                "Press continue to proceed",
                [
                  {
                    text: "Continue",
                    onPress: () => {
                      router.back();
                    },
                  },
                ]
              );
              // console.log(scoutingReportResponse.data);
            }
          })}
          loading={createResult.isLoading || updateResult.isLoading}
        />
      </ScrollView>
    </>
  );
};
