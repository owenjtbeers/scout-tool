import { Dialog, Header, useTheme } from "@rneui/themed";
import React, { useEffect, useState, useCallback } from "react";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import {
  Control,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormWatch,
  set,
  useForm,
} from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import type { Field } from "../../redux/fields/types";
import { getMostRecentCrop } from "../../redux/fields/utils";
import { globalSelectionsSlice } from "../../redux/globalSelections/globalSelectionsSlice";
import { drawingSlice } from "../../redux/map/drawingSlice";
import {
  APIScoutingReport,
  ScoutingImage,
  ScoutingReportStatus,
} from "../../redux/scouting/types";
import { ScoutingReportMapView } from "./ScoutingReportMapView";
import { ScoutingSideSheet } from "./ScoutingSideSheet";
import { ScoutingCameraView } from "./camera/ScoutingCameraView";
import { ScoutingReportObservationContent } from "./forms/ScoutingReportObservationContent";
import { ScoutingReportSummaryContent } from "./forms/ScoutingReportSummaryContent";
import { ScoutingReportForm } from "./types";
import { convertObservationAreasToScoutingAreas } from "./utils/scoutReportUtils";
import { FinishWithScoutingReport } from "./forms/FinishWithReport";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { SCOUTING_SLICE_REDUCER_KEY } from "../../redux/scouting/scoutingSlice";
import { de } from "react-native-paper-dates";

interface CreateScoutingReportPageProps {
  mode: "create" | "edit";
  existingScoutingReport?: APIScoutingReport;
  // Only useful if in edit mode
  isFetchingScoutingReport: boolean;
  fields: Field[];
  growerName?: string;
  growerEmail?: string;
  farmName?: string;
  draftedReportKey?: string;
}

export const CreateScoutingReportPage = (
  props: CreateScoutingReportPageProps
) => {
  const {
    mode,
    existingScoutingReport,
    isFetchingScoutingReport,
    fields,
    growerName,
    farmName,
    draftedReportKey,
    growerEmail,
  } = props;
  const router = useRouter();
  let listener = () => { };
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const draftedReports = useSelector(
    (state: RootState) => state[SCOUTING_SLICE_REDUCER_KEY].draftedReports
  );
  // TODO: Convert this to be multiple selected fields if possible
  const selectedField = fields[0];
  // Fetch existing scouting report if in edit mode

  let defaultFormValues = undefined;
  if (draftedReportKey) {
    const draftedReport = draftedReports[draftedReportKey];
    if (draftedReport) {
      // @ts-ignore not worth fixing
      defaultFormValues = { ...draftedReport, scoutedDate: new Date(draftedReport.scoutedDate) };
      console.log("Drafted Report", draftedReport);
      console.log("Scouted Date", draftedReport.scoutedDate);
    }
  }
  console.log(draftedReportKey);

  if (!draftedReportKey) {
    console.log("No Drafted Report Key");
    defaultFormValues =
      mode === "edit" && existingScoutingReport
        ? {
          ID: existingScoutingReport.ID,
          scoutingAreas: convertObservationAreasToScoutingAreas(
            existingScoutingReport.ObservationAreas
          ),
          // @ts-ignore TODO: Fix this
          scoutedBy: existingScoutingReport.ScoutedBy,
          scoutedById: existingScoutingReport.ScoutedById,
          scoutedDate: new Date(existingScoutingReport.ScoutedDate),
          summaryText: existingScoutingReport.Summary,
          fieldIds: existingScoutingReport.FieldIds.map((obj) => obj.ID),
          images: existingScoutingReport?.Images || [],
          recommendations: existingScoutingReport.Recommendation,
          growthStage: existingScoutingReport.GrowthStage,
          field: selectedField,
          growerName,
          growerEmail,
          farmName,
          crop: existingScoutingReport.Crop,
          status: existingScoutingReport.Status,
        }
        : {
          ID: 0,
          scoutingAreas: [
            {
              ID: 0,
              UId: "Main",
              ScoutReportId: 0,
              Geometry: {
                type: "FeatureCollection",
                features: [],
              },
              WeedObservations: [],
              InsectObservations: [],
              DiseaseObservations: [],
              GeneralObservations: [],
              Type: "Main",
            },
          ],
          scoutedDate: new Date(),
          scoutedBy: undefined,
          media: [],
          summaryText: "",
          recommendations: "",
          growthStage: "",
          fieldIds: fields.map((field) => field.ID),
          images: [],
          field: selectedField,
          growerName,
          growerEmail,
          farmName,
          crop: getMostRecentCrop(selectedField.FieldCrops)?.Crop,
          status: "draft" as ScoutingReportStatus,
          uniqueDraftID:
            fields.map((field) => field.ID).join(",") + "-" + Date.now(),
        };
  }

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isDirty, isValid, isSubmitSuccessful },
    reset,
    watch,
  } = useForm<ScoutingReportForm>({
    defaultValues: defaultFormValues,
  });

  // Internal State
  const [isDrawingScoutingArea, setIsDrawingScoutingArea] = useState(false);
  const [isDoneWithReport, setIsDoneWithReport] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [photoMetaData, setPhotoMetadata] = useState<ScoutingImage | null>(
    null
  );
  const [selectedScoutingAreaIndex, setSelectedScoutingAreaIndex] = useState(0);
  const [sideSheetContentType, setSideSheetContentType] = useState<
    "summary" | "observation"
  >("summary");

  // Effects
  useEffect(() => {
    listener = navigation.addListener("beforeRemove", handleBeforeRemove);
    return () => navigation.removeListener("beforeRemove", handleBeforeRemove);
  }, []);


  // Callback definitions
  const onLeavePage = () => {
    reset();
    dispatch(drawingSlice.actions.clearState());
    dispatch(globalSelectionsSlice.actions.setField(null));
    navigation.removeListener("beforeRemove", () => { });
    router.back();
  };

  const createLeavePageAlert = () => {
    Alert.alert(
      "Discard Changes?",
      "Are you sure you want to discard changes?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Discard",
          onPress: () => {
            onLeavePage();
          },
        },
      ]
    );
  };
  const onClose = () => {
    if (isDirty) {
      // Set Dialog to open that prompts user to save or discard changes
      if (isSubmitSuccessful) {
        navigation.removeListener("beforeRemove", handleBeforeRemove);
        router.back();
      } else {
        createLeavePageAlert();
      }
    } else {
      onLeavePage();
    }
  };
  const handleBeforeRemove = useCallback((e: any) => {
    if (isDirty) {
      e.preventDefault();
      createLeavePageAlert();
    }
  }, []);

  if (isFetchingScoutingReport) {
    return <ActivityIndicator />;
  }

  if (isTakingPhoto) {
    return (
      <ScoutingCameraView
        setIsTakingPhoto={setIsTakingPhoto}
        photoMetadata={photoMetaData}
        setPhotoMetadata={setPhotoMetadata}
        pathToFormValue={"images"}
        formGetValues={getValues}
        formSetValue={setValue}
      />
    );
  }

  if (isDoneWithReport) {
    return (
      <FinishWithScoutingReport
        handleSubmitScoutingReport={handleSubmit}
        onBackToForm={() => setIsDoneWithReport(false)}
        control={control}
        onSuccess={onLeavePage}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-sharp" size={24} color="white" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "Create Scouting Report",
          style: styles.heading,
        }}
      />
      <View style={{ flex: 1 }}>
        <ScoutingReportMapView
          setFormValue={setValue}
          getFormValues={getValues}
          fields={[selectedField]}
          setSideSheetContentType={setSideSheetContentType}
          setIsDrawingScoutingArea={setIsDrawingScoutingArea}
          isDrawingScoutingArea={isDrawingScoutingArea}
        />
        <CreateScoutReportForm
          formControl={control}
          watch={watch}
          field={selectedField}
          handleSubmit={handleSubmit}
          formGetValues={getValues}
          formSetValue={setValue}
          sideSheetContentType={sideSheetContentType}
          setSideSheetContentType={setSideSheetContentType}
          isDrawingScoutingArea={isDrawingScoutingArea}
          setIsDoneWithReport={setIsDoneWithReport}
          setIsDrawingScoutingArea={setIsDrawingScoutingArea}
          setIsTakingPhoto={setIsTakingPhoto}
          setPhotoMetadata={setPhotoMetadata}
          selectedScoutingAreaIndex={selectedScoutingAreaIndex}
          setSelectedScoutingAreaIndex={setSelectedScoutingAreaIndex}
        />
      </View>
    </View>
  );
};

interface ScoutingReportFormProps {
  field: Field;
  handleSubmit: UseFormHandleSubmit<ScoutingReportForm>;
  formControl: Control<ScoutingReportForm>;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
  formSetValue: UseFormSetValue<ScoutingReportForm>;
  watch: UseFormWatch<ScoutingReportForm>;
  sideSheetContentType: "summary" | "observation";
  setSideSheetContentType: (contentType: "summary" | "observation") => void;
  isDrawingScoutingArea: boolean;
  setIsDrawingScoutingArea: (isDrawing: boolean) => void;
  setIsTakingPhoto: (isTakingPhoto: boolean) => void;
  setPhotoMetadata: (metadata: ScoutingImage) => void;
  setIsDoneWithReport: (isDone: boolean) => void;
  setSelectedScoutingAreaIndex: (index: number) => void;
  selectedScoutingAreaIndex: number;
}
const CreateScoutReportForm = ({
  field,
  formControl,
  formGetValues,
  formSetValue,
  handleSubmit,
  sideSheetContentType,
  setSideSheetContentType,
  watch,
  isDrawingScoutingArea,
  setIsDrawingScoutingArea,
  setIsTakingPhoto,
  setPhotoMetadata,
  selectedScoutingAreaIndex,
  setSelectedScoutingAreaIndex,
  setIsDoneWithReport,
}: ScoutingReportFormProps) => {
  const { theme } = useTheme();

  return (
    <ScoutingSideSheet isDrawing={isDrawingScoutingArea}>
      {sideSheetContentType === "summary" ? (
        <ScoutingReportSummaryContent
          field={field}
          formControl={formControl}
          formGetValues={formGetValues}
          watch={watch}
          setSelectedScoutingAreaIndex={setSelectedScoutingAreaIndex}
          setSideSheetContentType={setSideSheetContentType}
          setIsDrawingScoutingArea={setIsDrawingScoutingArea}
          setIsDoneWithReport={setIsDoneWithReport}
          formSetValue={formSetValue}
        // setIsTakingPhoto={setIsTakingPhoto}
        // setPhotoMetadata={setPhotoMetadata}
        />
      ) : (
        <ScoutingReportObservationContent
          scoutingAreaFormIndex={selectedScoutingAreaIndex}
          field={field}
          formControl={formControl}
          formGetValues={formGetValues}
          formSetValue={formSetValue}
          setSideSheetContentType={setSideSheetContentType}
          setIsTakingPhoto={setIsTakingPhoto}
          setPhotoMetadata={setPhotoMetadata}
          watch={watch}
        />
      )}
    </ScoutingSideSheet>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  page: {
    flex: 1,
    padding: 10,
    paddingTop: 25,
  },
  heading: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  floatingScoutButton: {
    padding: 5,
    position: "absolute",
    // bottom: 0,
    right: 0,
    // margin: 20,
    // width: 200,
    zIndex: 100,
  },
  largeTextInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sideSheet: {
    width: "100%",
    flex: 1,
  },
  buttonText: {
    fontWeight: "bold",
  },
});
