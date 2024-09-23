import React from "react";
import { Alert, ActivityIndicator, StyleSheet } from "react-native";
import { Button, useTheme, Text } from "@rneui/themed";
import { mapFormDataToPostScoutReport } from "../utils/scoutReportUtils";
import { useGetCurrentUserQuery } from "../../../redux/user/userApi";
import {
  useCreateScoutingReportMutation,
  useUpdateScoutingReportMutation,
} from "../../../redux/scouting/scoutingApi";
import { useRouter } from "expo-router";
import { postScoutingImagesAsync } from "../../../utils/network/uploadToS3";
import {
  Controller,
  UseFormHandleSubmit,
  useForm,
  Control,
} from "react-hook-form";
import type { ScoutingReportForm } from "../types";
import { ScoutingReportStatus } from "../../../redux/scouting/types";
import { DialogPickerSelect } from "../../../forms/components/DialogPicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { scoutingSlice } from "../../../redux/scouting/scoutingSlice";
import { useDispatch } from "react-redux";

interface FinishWithScoutingReportProps {
  onBackToForm: () => void;
  onSuccess: () => void;
  handleSubmitScoutingReport: UseFormHandleSubmit<ScoutingReportForm>;
  control: Control<ScoutingReportForm, any>;
}

export const FinishWithScoutingReport = (
  props: FinishWithScoutingReportProps
) => {
  const { handleSubmitScoutingReport, onBackToForm, onSuccess, control } =
    props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [updateScoutReport, updateResult] = useUpdateScoutingReportMutation();
  const [createScoutingReport, createResult] =
    useCreateScoutingReportMutation();
  const { data: currentUserResponse } = useGetCurrentUserQuery("default");

  if (updateResult.isLoading || createResult.isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView>
      <Text h1 style={{ textAlign: "center" }}>
        Finish with Report
      </Text>
      <Text style={styles.descriptionText}>
        Draft is for reports that are not yet ready for review, or for not
        syncing to the server
        {"\n"}
      </Text>
      <Text style={styles.descriptionText}>
        In Review is for reports that are ready for review, and will be synced
        to the server. Your manager will be able to see these reports and review
        {"\n"}
      </Text>
      <Text style={styles.descriptionText}>
        Reviewed is for managers to flag the report as reviewed
      </Text>
      <Text h4 style={{ textAlign: "center" }}>
        Please select the status you would like to move this report to
      </Text>
      <Controller
        name="status"
        control={control}
        render={({ field: { onChange, value } }) => (
          <DialogPickerSelect
            label={"Move to Status"}
            dialogTitle="Status"
            options={
              [
                { label: "Draft", value: "draft" },
                { label: "In Review", value: "in_review" },
                { label: "Reviewed", value: "passed_review" },
              ] as { label: string; value: ScoutingReportStatus }[]
            }
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Button onPress={onBackToForm}>Back</Button>
      <Button
        onPress={handleSubmitScoutingReport(
          async (data) => {
            const user = currentUserResponse?.data;
            const postData = mapFormDataToPostScoutReport(data, user);
            let scoutingReportResponse;
            if (postData.ID) {
              console.log(postData?.ObservationAreas?.[0].Geometry)
              scoutingReportResponse = await updateScoutReport({
                id: postData.ID,
                data: postData,
              });
            } else {
              if (postData.Status === "draft") {
                // data.scoutedDate = data.scoutedDate.toDateString();
                dispatch(
                  scoutingSlice.actions.setDraftedReport({
                    key: data.uniqueDraftID || "default",
                    report: data,
                  })
                );
              } else {
                scoutingReportResponse = await createScoutingReport(postData);
              }
            }

            if (scoutingReportResponse?.error) {
              console.error(scoutingReportResponse.error);
            } else {
              if (data?.images?.length > 0) {
                Alert.alert(
                  "Uploading Scouting Images",
                  "Please wait while we upload your scouting images"
                );
                await postScoutingImagesAsync(
                  // @ts-ignore TODO: Type this better
                  scoutingReportResponse?.data?.ImageUploads,
                  data.images
                );
              }
              if (data.uniqueDraftID) {
                dispatch(
                  scoutingSlice.actions.removeDraftedReport(data.uniqueDraftID)
                );
              }
              Alert.alert(
                "Scouting Report saved successfully",
                "Press continue to proceed",
                [
                  {
                    text: "Continue",
                    onPress: () => {

                    },
                  },
                ]
              );
              onSuccess && onSuccess();
            }

          },
          // Go back to form if there is an error
          onBackToForm
        )}
      >
        Save
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  descriptionText: {
    padding: 10,
  },
});
