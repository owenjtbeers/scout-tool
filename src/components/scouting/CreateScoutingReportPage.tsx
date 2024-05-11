import { Dialog, Header, useTheme } from "@rneui/themed";
import React, { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import {
  Control,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { Field } from "../../redux/fields/types";
import { globalSelectionsSlice } from "../../redux/globalSelections/globalSelectionsSlice";
import {
  MAP_DRAWING_REDUCER_KEY,
  drawingSlice,
} from "../../redux/map/drawingSlice";
import { RootState } from "../../redux/store";
import { ScoutingReportMapView } from "./ScoutingReportMapView";
import { ScoutingSideSheet } from "./ScoutingSideSheet";
import { ScoutingReportSummaryContent } from "./forms/ScoutingReportSummaryContent";
import { ScoutingReportObservationContent } from "./forms/ScoutingReportObservationContent";
import { ScoutingReportForm } from "./types";
import { ScoutingReport } from "../../redux/scouting/types";

interface CreateScoutingReportPageProps {
  mode: "create" | "edit";
  existingScoutingReport?: ScoutingReport;
  // Only useful if in edit mode
  isFetchingScoutingReport: boolean;
  fields: Field[];
}

export const CreateScoutingReportPage = (
  props: CreateScoutingReportPageProps
) => {
  const { mode, existingScoutingReport, isFetchingScoutingReport, fields } =
    props;
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // TODO: Convert this to be multiple selected fields if possible
  const selectedField = fields[0];

  // Fetch existing scouting report if in edit mode

  const defaultFormValues =
    mode === "edit" && existingScoutingReport
      ? {
          ID: existingScoutingReport.ID,
          scoutingAreas: existingScoutingReport.ObservationAreas,
          scoutedBy: existingScoutingReport.ScoutedBy,
          scoutedById: existingScoutingReport.ScoutedById,
          scoutedDate: new Date(existingScoutingReport.ScoutedDate),
          media: [],
          summaryText: existingScoutingReport.Summary,
          fieldIds: existingScoutingReport.FieldIds.map((obj) => obj.ID),
        }
      : {
          ID: 0,
          scoutingAreas: [],
          media: [],
          summaryText: "",
          recommendationText: "",
          fieldIds: fields.map((field) => field.ID),
        };
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isDirty, isValid },
    reset,
    watch,
  } = useForm<ScoutingReportForm>({
    defaultValues: defaultFormValues,
  });

  // Internal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawingScoutingArea, setIsDrawingScoutingArea] = useState(false);
  const [sideSheetContentType, setSideSheetContentType] = useState<
    "summary" | "observation"
  >("summary");

  // Effects
  useEffect(() => {
    navigation.addListener("beforeRemove", handleBeforeRemove);
    return () => navigation.removeListener("beforeRemove", handleBeforeRemove);
  }, [isDirty]);

  // Callback definitions
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
            reset();
            dispatch(drawingSlice.actions.clearState());
            navigation.removeListener("beforeRemove", handleBeforeRemove);
            router.back();
          },
        },
      ]
    );
  };
  const onClose = () => {
    if (isDirty) {
      // Set Dialog to open that prompts user to save or discard changes
      createLeavePageAlert();
    } else {
      dispatch(globalSelectionsSlice.actions.setField(null));
      dispatch(drawingSlice.actions.clearState());
      router.back();
    }
  };
  const handleBeforeRemove = (e: any) => {
    if (isDirty) {
      e.preventDefault();
      createLeavePageAlert();
    }
  };

  if (isFetchingScoutingReport) {
    return <ActivityIndicator />;
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
          setIsDrawingScoutingArea={setIsDrawingScoutingArea}
        />
      </View>

      <Dialog
        isVisible={isDialogOpen}
        onDismiss={() => setIsDialogOpen(false)}
      ></Dialog>
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
}: ScoutingReportFormProps) => {
  const { theme } = useTheme();

  const [selectedScoutingAreaIndex, setSelectedScoutingAreaIndex] = useState(0);

  return (
    <ScoutingSideSheet isDrawing={isDrawingScoutingArea}>
      {sideSheetContentType === "summary" ? (
        <ScoutingReportSummaryContent
          field={field}
          formControl={formControl}
          formGetValues={formGetValues}
          handleSubmit={handleSubmit}
          watch={watch}
          setSelectedScoutingAreaIndex={setSelectedScoutingAreaIndex}
          setSideSheetContentType={setSideSheetContentType}
          setIsDrawingScoutingArea={setIsDrawingScoutingArea}
        />
      ) : (
        <ScoutingReportObservationContent
          scoutingAreaFormIndex={selectedScoutingAreaIndex}
          field={field}
          formControl={formControl}
          formGetValues={formGetValues}
          formSetValue={formSetValue}
          setSideSheetContentType={setSideSheetContentType}
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
