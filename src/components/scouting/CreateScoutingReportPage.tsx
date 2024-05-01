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
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { Field } from "../../redux/fields/types";
import {
  GLOBAL_SELECTIONS_REDUCER_KEY,
  globalSelectionsSlice,
} from "../../redux/globalSelections/globalSelectionsSlice";
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

export const CreateScoutingReportPage = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // TODO: Convert this to be multiple selected fields if possible
  const selectedField = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].field as Field
  );

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isDirty, isValid },
    reset,
    watch,
  } = useForm<ScoutingReportForm>({
    defaultValues: {
      scoutingAreas: [],
      media: [],
      summaryText: "",
      recommendationText: "",
      fieldIds: [selectedField.ID]
    },
  });

  // Internal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
}: ScoutingReportFormProps) => {
  const { theme } = useTheme();

  const isDrawing = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].isDrawing
  );

  return (
    <ScoutingSideSheet isDrawing={isDrawing}>
      {sideSheetContentType === "summary" ? (
        <ScoutingReportSummaryContent
          field={field}
          formControl={formControl}
          formGetValues={formGetValues}
          handleSubmit={handleSubmit}
          watch={watch}
        />
      ) : (
        <ScoutingReportObservationContent
          scoutingAreaFormIndex={formGetValues("scoutingAreas").length - 1}
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
