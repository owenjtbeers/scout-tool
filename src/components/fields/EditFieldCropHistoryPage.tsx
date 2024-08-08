import React from "react";
import {
  ScrollView,
  View,
  Alert,
  TouchableOpacity,
  Touchable,
} from "react-native";
import { Button, Dialog, useTheme, Text, Input } from "@rneui/themed";
import { Controller, set, useForm, UseFormGetValues } from "react-hook-form";
import { ActivityIndicator } from "react-native";
import { DatePickerInput } from "react-native-paper-dates";
import { useSelector } from "react-redux";
import {
  useGetOrgCropsQuery,
  useGetFieldCropsForFieldQuery,
  useUpdateFieldCropsMutation,
} from "../../redux/crops/cropsApi";
import { Crop, FieldCrop, OrgCrop } from "../../redux/crops/types";
import { Field } from "../../redux/fields/types";
import { GLOBAL_SELECTIONS_REDUCER_KEY } from "../../redux/globalSelections/globalSelectionsSlice";
import { RootState } from "../../redux/store";
import { ErrorMessage } from "../../forms/components/ErrorMessage";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "../../utils/formatting/dates";
import { getErrorMessage } from "../../utils/errors";
import { DialogPickerSelect } from "../../forms/components/DialogPicker";

interface EditFieldCropHistoryPageProps {
  onClose: () => void;
  isVisible: boolean;
}
export const EditFieldCropHistoryPage = (
  props: EditFieldCropHistoryPageProps
) => {
  const { onClose, isVisible } = props;
  const [isSaving, setIsSaving] = React.useState(false);
  const selectedField = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].field
  );
  const { data: cropsResponse, isFetching: isFetchingCrops } =
    useGetOrgCropsQuery("default", { refetchOnMountOrArgChange: true });
  const { data: fieldCropsResponse, isFetching: isFetchingFieldCrops } =
    useGetFieldCropsForFieldQuery(
      { fieldId: selectedField?.ID || 0 },
      { refetchOnMountOrArgChange: true }
    );

  return (
    <Dialog onBackdropPress={undefined} isVisible={isVisible}>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Dialog.Title title={"Edit Crop History"} />
        <Ionicons
          name="close-sharp"
          size={24}
          color="black"
          onPress={onClose}
        />
      </View>
      {isSaving || isFetchingCrops || isFetchingFieldCrops ? (
        <ActivityIndicator />
      ) : (
        <FieldCropHistoryForm
          selectedField={selectedField}
          fieldCrops={
            fieldCropsResponse?.data.map((fieldCrop) => ({
              ...fieldCrop,
              PlantedDate: new Date(fieldCrop.PlantedDate),
              EndDate: fieldCrop.EndDate
                ? new Date(fieldCrop.EndDate)
                : undefined,
            })) || []
          }
          crops={cropsResponse?.data || []}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
};

interface FormFieldCrop extends Omit<FieldCrop, "PlantedDate" | "EndDate"> {
  PlantedDate: Date;
  EndDate?: Date;
}

interface FieldCropHistoryFormProps {
  selectedField: Field | null;
  fieldCrops: FormFieldCrop[];
  crops: OrgCrop[];
  onClose: () => void;
}
const FieldCropHistoryForm = (props: FieldCropHistoryFormProps) => {
  const { selectedField, fieldCrops, onClose, crops } = props;
  const [isAddingFieldCrop, setIsAddingFieldCrop] = React.useState(false);
  const [updateFieldCrops] = useUpdateFieldCropsMutation();
  const [cropHistoryValue, setCropHistoryValue] =
    React.useState<FormFieldCrop | null>(null);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const { theme } = useTheme();
  const defaultValues = {
    fieldCrops: fieldCrops,
  };
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isDirty, isValid, isSubmitSuccessful },
    reset,
    watch,
  } = useForm({ defaultValues });

  const dateOptions = {
    year: "numeric",
    month: "long",
  } as Intl.DateTimeFormatOptions;
  return (
    <>
      {isAddingFieldCrop && (
        <EditingFieldCropForm
          onSave={(data: FormFieldCrop) => {
            setValue(`fieldCrops.${editingIndex as number}`, data);
            setIsAddingFieldCrop(false);
          }}
          onCancel={() => setIsAddingFieldCrop(false)}
          onDelete={() => {
            const newFieldCropsList = getValues("fieldCrops").filter(
              (_, index) => index !== editingIndex
            );
            setValue(`fieldCrops`, newFieldCropsList);
            setIsAddingFieldCrop(false);
          }}
          defaultValues={cropHistoryValue as FormFieldCrop}
          orgCrops={crops}
        />
      )}
      {!isAddingFieldCrop && (
        <>
          <Button
            title={"Add New Crop History"}
            onPress={() => {
              setCropHistoryValue({
                ID: 0,
                FieldId: selectedField?.ID || 0,
                CropId: 0,
                Crop: { ID: 0, Name: "" },
                PlantedDate: new Date(),
                EndDate: undefined,
              });
              setEditingIndex(getValues("fieldCrops").length);
              setIsAddingFieldCrop(true);
            }}
          />
          <ScrollView>
            {getValues("fieldCrops").map((fieldCrop: FormFieldCrop, index) => (
              <TouchableOpacity
                key={`field-crop-${index}`}
                style={{
                  display: "flex",
                  borderColor: "black",
                  borderWidth: 1,
                  margin: 10,
                }}
                onPress={() => {
                  setCropHistoryValue(fieldCrop);
                  setEditingIndex(index);
                  setIsAddingFieldCrop(true);
                }}
              >
                <Text>{fieldCrop?.Crop?.Name}</Text>
                <Text>{`    Planted - ${formatDate(
                  fieldCrop?.PlantedDate,
                  dateOptions
                )}`}</Text>
                {fieldCrop?.EndDate && (
                  <Text>{`    Ended - ${formatDate(
                    fieldCrop.EndDate,
                    dateOptions
                  )}`}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Dialog.Actions>
            <Dialog.Button title={"Cancel"} onPress={onClose} />
            <Dialog.Button
              title={"Save"}
              onPress={handleSubmit(
                async (data) => {
                  // if (!isDirty) {
                  //   onClose();
                  //   return;
                  // }
                  const newData = data.fieldCrops.map((formFieldCrop) => ({
                    ...formFieldCrop,
                    PlantedDate: formFieldCrop.PlantedDate.toISOString(),
                    // EndDate: null,
                    EndDate: formFieldCrop.EndDate?.toISOString() || undefined,
                  }));
                  console.log("New Data", newData);
                  const response = await updateFieldCrops({
                    fieldId: selectedField?.ID as number,
                    data: newData,
                  });
                  console.log("Response", response);
                  if (response?.data) {
                    onClose();
                  } else if (getErrorMessage(response)) {
                    console.log("Error", getErrorMessage(response));
                    Alert.alert(
                      "Error saving field crops",
                      getErrorMessage(response)
                    );
                  }
                },
                () => {}
              )}
            />
          </Dialog.Actions>
        </>
      )}
    </>
  );
};

interface EditingFieldCropFormProps {
  onSave: (formFieldCrop: FormFieldCrop) => void;
  onDelete: () => void;
  onCancel: () => void;
  defaultValues: FormFieldCrop;
  orgCrops: OrgCrop[];
}
const EditingFieldCropForm = (props: EditingFieldCropFormProps) => {
  const { defaultValues, onSave, onCancel, onDelete, orgCrops } = props;
  const [isAddingNewCropName, setIsAddingNewCropName] = React.useState(false);
  const { theme } = useTheme();
  const { control, handleSubmit, getValues } = useForm<FormFieldCrop>({
    defaultValues,
  });

  const getCropOptions = () => {
    const fieldCrop = getValues("Crop");
    const orgCropNames = orgCrops.map((orgCrop) => orgCrop.Name);
    const fieldCropNames = [fieldCrop.Name];
    const uniqueOptions = new Set([...orgCropNames, ...fieldCropNames]);
    return Array.from(uniqueOptions).map((option) => ({
      label: option,
      value: option,
    }));
    // Need to make a unique set of options between field crops and org crop names
  };
  return (
    <ScrollView>
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            {isAddingNewCropName && (
              <Input
                label="Crop Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={{ backgroundColor: theme.colors.grey0 }}
                errorMessage={error?.message}
              />
            )}
            {!isAddingNewCropName && (
              // Dropdown of org crop names to select from

              <DialogPickerSelect
                label={"Crop"}
                options={getCropOptions()}
                onChangeText={onChange}
                value={value}
                onAddNewOption={(value: string) => {
                  onChange(value);
                  setIsAddingNewCropName(false);
                }}
                errorMessage={error?.message}
              />
            )}
          </>
        )}
        name={`Crop.Name`}
        rules={{
          required: "Crop Name is required",
          minLength: { value: 3, message: "Must be at least three characters" },
        }}
        defaultValue={""}
      />

      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <DatePickerInput
              label="Planted Date"
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
            {error && <ErrorMessage message={error.message} />}
          </>
        )}
        name={`PlantedDate`}
        rules={{ required: true }}
        defaultValue={new Date()}
      />
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <DatePickerInput
              label="End Date"
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
            {error && <ErrorMessage message={error.message} />}
          </>
        )}
        name={`EndDate`}
        rules={{ required: false }}
      />
      <Dialog.Actions>
        <Dialog.Button title={"Cancel"} onPress={onCancel} />
        <Dialog.Button
          title={"Save"}
          onPress={handleSubmit((data) => {
            console.log("Data in form", data);
            onSave(data);
          })}
        />
        <Dialog.Button
          title={"Delete"}
          icon={
            <Ionicons
              name="remove-circle"
              size={20}
              color={theme.colors.primary}
            />
          }
          onPress={() => {
            Alert.alert(
              "Delete Crop History?",
              `Are you sure you want to delete this crop history?`,
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  onPress: () => {
                    onDelete();
                  },
                },
              ]
            );
          }}
        />
      </Dialog.Actions>
    </ScrollView>
  );
};
