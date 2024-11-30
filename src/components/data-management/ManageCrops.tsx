import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, ListItem, useTheme, Dialog, Input } from "@rneui/themed";
import { useRouter, useNavigation } from "expo-router";
import { ScrollView, RefreshControl, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { userSlice } from "../../redux/user/userSlice";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { HOME_SETTINGS_SCREEN } from "../../navigation/screens";
import alert from "../polyfill/Alert";
import {
  useGetOrgCropsQuery,
  useGetGenericCropListQuery,
  useCreateOrgCropMutation,
  useEditOrgCropMutation,
  useDeleteOrgCropMutation,
} from "../../redux/crops/cropsApi";
import { OrgCrop } from "../../redux/crops/types";
import { ScoutingAppUser } from "../../redux/user/types";
import { navigateToNextPhaseOfTutorial } from "../tutorial/navigation";
import { useUpdateTutorialProgressMutation } from "../../redux/user/userApi";
import ColorPicker, {
  Panel1,
  Preview,
  Swatches,
} from "reanimated-color-picker";
import { styles } from "./styles";
import { DARK_GREEN_PRIMARY } from "../../constants/styles";

interface FormCrop {
  Name: string;
  ID: number;
  Color?: string;
  generic?: boolean;
}

interface EditCropDialogProps {
  crop?: OrgCrop;
  onClose: () => void;
  onBackdropPress: () => void;
  refetchCrops: () => void;
}

const EditCropDialog: React.FC<EditCropDialogProps> = ({
  crop,
  onClose,
  onBackdropPress,
  refetchCrops,
}) => {
  const [editCrop] = useEditOrgCropMutation();
  const { handleSubmit, control } = useForm<FormCrop>({
    defaultValues: {
      ID: crop?.ID || 0,
      Name: crop?.Name || "",
      Color: crop?.Color || DARK_GREEN_PRIMARY,
    },
  });

  const onValidSubmit = async (data: FormCrop) => {
    const response = await editCrop(data);
    if ("error" in response) {
      // @ts-expect-error
      alert("Error saving crop", response?.error?.error);
    }
    onClose();
    refetchCrops();
  };

  return (
    <Dialog isVisible={true} onBackdropPress={onBackdropPress}>
      <Dialog.Title title={crop ? "Edit Crop" : "Add New Crop"} />
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <Input
            placeholder="Enter Crop Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            label="* Crop Name"
            errorMessage={error?.message}
          />
        )}
        name="Name"
        rules={{
          required: "Crop Name is required",
          minLength: {
            value: 2,
            message: "Must be at least two characters long",
          },
        }}
      />
      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Text>Field Border Color</Text>
            <ColorPicker
              onComplete={({ hex: value }) => onChange(value)}
              value={value}
            >
              <Panel1 />
              <Swatches />
              <Preview />
            </ColorPicker>
          </>
        )}
        name="Color"
        rules={{
          required: "Crop Color is required",
        }}
      />
      <Dialog.Actions>
        <Button title="Save" onPress={handleSubmit(onValidSubmit)} />
      </Dialog.Actions>
    </Dialog>
  );
};

interface DeleteCropDialogProps {
  crop?: { ID: number; Name: string };
  onClose: () => void;
  onBackdropPress: () => void;
  refetchCrops: () => void;
}

const DeleteCropDialog: React.FC<DeleteCropDialogProps> = ({
  crop,
  onClose,
  onBackdropPress,
  refetchCrops,
}) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [deleteCrop] = useDeleteOrgCropMutation();

  const handleDelete = async () => {
    if (!crop) return;
    const response = await deleteCrop(crop.ID);
    if (response.error) {
      console.warn(response.error);
      // @ts-expect-error
      alert("Error deleting crop", response?.error?.error);
    }
    refetchCrops();
    onClose();
  };

  return (
    <Dialog isVisible={true} onBackdropPress={onBackdropPress}>
      <Dialog.Title title="Delete Crop" />
      {currentUser?.AccountType === "org_admin" ? (
        <>
          <Text style={{ marginBottom: 16, textAlign: "center" }}>
            Are you sure you want to delete {crop?.Name}? This action cannot be
            undone.
          </Text>
          <Text style={{ marginBottom: 16, textAlign: "center", color: "red" }}>
            Warning: Deleting this crop will remove it from all existing reports
            and fields.
          </Text>
          <Dialog.Actions>
            <Button
              title="Cancel"
              onPress={onClose}
              type="outline"
              containerStyle={{ marginRight: 8 }}
            />
            <Button
              title="Delete"
              onPress={handleDelete}
              buttonStyle={{ backgroundColor: "red" }}
            />
          </Dialog.Actions>
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 16, textAlign: "center" }}>
            Please contact your organization administrator to delete crops.
          </Text>
          <Dialog.Actions>
            <Button title="OK" onPress={onClose} />
          </Dialog.Actions>
        </>
      )}
    </Dialog>
  );
};

interface AddCropsDialogProps {
  onClose: () => void;
  onBackdropPress: () => void;
  refetchCrops: () => void;
  onCompleteCropsTutorialStep: () => void;
}

interface AddCropForm {
  crops: FormCrop[];
}

const AddCropsDialog: React.FC<AddCropsDialogProps> = ({
  onClose,
  onBackdropPress,
  refetchCrops,
  onCompleteCropsTutorialStep,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  // @ts-ignore Note: User will be logged in and an actual user
  const currentUser: ScoutingAppUser = useSelector(
    (state: RootState) => state.user.currentUser
  );
  const [createOrgCrop] = useCreateOrgCropMutation();
  const [updateTutorialProgress] = useUpdateTutorialProgressMutation();
  const { data: genericCrops } = useGetGenericCropListQuery("default", {
    refetchOnReconnect: true,
  });
  const { control, handleSubmit, watch, setValue } = useForm<AddCropForm>({
    defaultValues: {
      crops: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "crops",
  });

  const onValidSubmit = async (data: AddCropForm) => {
    try {
      // Create each crop sequentially. Save the response for each crop
      const results = [];
      for (const crop of data.crops) {
        const trimmedCropName = crop.Name?.trim();
        if (trimmedCropName) {
          const result = await createOrgCrop({
            ...crop,
            Name: trimmedCropName,
          });
          if (!result.error) {
            results.push({
              cropName: trimmedCropName,
              ID: result.data?.data?.ID,
            });
          }
        }
      }
      if (data.crops.length > 0) {
        await onCompleteCropsTutorialStep();
        alert(`Created ${results.length} of ${data.crops.length}`, "");
      }
      refetchCrops();
      onClose();
    } catch (error) {
      alert("Error adding crops", "");
    }
  };

  return (
    <Dialog isVisible={true} onBackdropPress={onBackdropPress}>
      <Dialog.Title title="Add New Organization Crops" />
      {fields.length > 0 && (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            textAlign: "left",
            marginLeft: 10,
            marginVertical: 12,
            color: "#666",
          }}
        >{`Adding ${fields.length} Organization Crops`}</Text>
      )}
      <ScrollView style={{ maxHeight: 300 }}>
        {genericCrops?.data?.length && (
          <Text style={{ marginLeft: 10, fontWeight: "bold" }}>
            {"Select all that apply"}
          </Text>
        )}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            padding: 10,
          }}
        >
          {genericCrops?.data?.map((crop) => {
            const isSelected = fields.some(
              (field) => field.Name?.toLowerCase() === crop.Name.toLowerCase()
            );
            return (
              <Button
                key={`${crop.Name}-${crop.ID}`}
                onPress={() => {
                  if (isSelected) {
                    const index = fields.findIndex(
                      (field) =>
                        field.Name?.toLowerCase() === crop.Name.toLowerCase()
                    );
                    if (index !== -1) {
                      remove(index);
                    }
                  } else {
                    // Add the crop, flag it as generic
                    append({
                      ID: 0,
                      Name: crop.Name,
                      Color: crop.DefaultColor,
                      generic: true,
                    });
                  }
                }}
                color={isSelected ? "secondary" : "primary"}
                radius={10}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  // borderWidth: 1,
                }}
                title={crop.Name}
                titleStyle={{
                  color: isSelected
                    ? theme.colors.primary
                    : theme.colors.secondary,
                  marginRight: isSelected ? 4 : 0,
                }}
                icon={
                  isSelected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={theme.colors.primary}
                    />
                  ) : undefined
                }
                iconRight={isSelected}
              ></Button>
            );
          })}
        </View>
      </ScrollView>
      <ScrollView style={{ maxHeight: 400 }}>
        {fields.map((field, index) => {
          if (field.generic) {
            return null;
          }
          return (
            <View key={field.id} style={{ marginBottom: 16 }}>
              <Controller
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <Input
                    placeholder="Enter Crop Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    label={`* Crop ${index + 1}`}
                    errorMessage={error?.message}
                    rightIcon={
                      fields.length > 1 ? (
                        <Button
                          type="clear"
                          icon={{
                            name: "delete",
                            color: "red",
                            size: 24,
                          }}
                          onPress={() => remove(index)}
                        />
                      ) : undefined
                    }
                  />
                )}
                name={`crops.${index}.Name`}
                rules={{
                  required: "Crop Name is required",
                  minLength: {
                    value: 2,
                    message: "Must be at least two characters long",
                  },
                }}
              />
            </View>
          );
        })}
      </ScrollView>
      <Button
        title="Not in the list? Add Another Crop"
        onPress={() => append({ Name: "", generic: false, ID: 0 })}
        containerStyle={{ marginVertical: 10 }}
      />

      <Dialog.Actions>
        <View style={{ flexDirection: "row", gap: 5 }}>
          {!currentUser?.Organization.hasSetupCrops && (
            <Button
              title="Skip"
              onPress={async () => {
                await onCompleteCropsTutorialStep();
                onClose();
              }}
            />
          )}
          <Button title="Cancel" onPress={onClose} type="solid" />
          <Button title="Save" onPress={handleSubmit(onValidSubmit)} />
        </View>
      </Dialog.Actions>
    </Dialog>
  );
};

export const ManageCrops: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const currentUser: ScoutingAppUser = useSelector(
    (state: RootState) => state.user.currentUser
  );
  const [selectedCrop, setSelectedCrop] = React.useState<OrgCrop>();
  const [isAddingCrops, setIsAddingCrops] = React.useState(
    !currentUser.Organization?.hasSetupCrops
  );
  const [cropToDelete, setCropToDelete] = React.useState<OrgCrop | undefined>(
    undefined
  );

  const [updateTutorialProgress] = useUpdateTutorialProgressMutation();
  const {
    data: orgCropData,
    isLoading,
    refetch: refetchOrgCrops,
    isFetching,
  } = useGetOrgCropsQuery("default");

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    } else {
      router.push(HOME_SETTINGS_SCREEN);
      return;
    }
  };

  const handleCloseDeleteDialog = () => {
    setCropToDelete(undefined);
  };

  const completeCropTutorialStep = async () => {
    const currentUserHasSetupCrops = currentUser?.Organization.hasSetupCrops;
    if (!currentUserHasSetupCrops) {
      const updatedUserOrg = {
        ...currentUser?.Organization,
        hasSetupCrops: true,
      };
      dispatch(userSlice.actions.updateUserOrganization(updatedUserOrg));
      await updateTutorialProgress({ hasSetupCrops: true });
      navigateToNextPhaseOfTutorial(router, updatedUserOrg);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 16,
          alignItems: "center",
        }}
      >
        <Button
          radius={5}
          title="Back"
          onPress={handleBack}
          containerStyle={{
            width: 100,
            borderRadius: 8,
          }}
        />
        <Button
          radius={5}
          title="Add Crop"
          icon={{ name: "add", size: 24, color: theme.colors.secondary }}
          onPress={() => setIsAddingCrops(true)}
          containerStyle={{
            width: 120,
            borderRadius: 8,
          }}
        />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetchOrgCrops} />
        }
        // contentContainerStyle={{ flex: 1 }}
        // style={{ flex: 1 }}
      >
        {isLoading ? (
          <Text>Loading crops...</Text>
        ) : orgCropData?.data?.length === 0 ? (
          <Text>No crops found. Add a crop to get started.</Text>
        ) : (
          <ScrollView style={{ flex: 1 }}>
            <Text h3 style={{ padding: 10, paddingLeft: 30 }}>
              Organization Crop List
            </Text>
            {orgCropData?.data?.length && (
              <Text
                style={{ padding: 10, paddingLeft: 40 }}
              >{`(${orgCropData?.data?.length}) crops`}</Text>
            )}
            {orgCropData?.data?.map((crop) => (
              <ListItem
                key={crop.ID}
                onPress={() => setSelectedCrop(crop)}
                containerStyle={styles.managementItem}
              >
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    {crop.Name}
                  </ListItem.Title>

                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: crop.Color,
                      borderRadius: 4,
                    }}
                  ></View>
                </ListItem.Content>
                <Button
                  // type="clear"
                  title="Edit"
                  icon={<ListItem.Chevron color={theme.colors.primary} />}
                  iconRight
                  color={"secondary"}
                  titleStyle={{ color: theme.colors.primary }}
                  onPress={() => setSelectedCrop(crop)}
                  // titleStyle={{ color: theme.colors.primary }}
                />
                <Button
                  type="clear"
                  icon={{
                    name: "delete",
                    color: theme.colors.error,
                    size: 24,
                  }}
                  onPress={() => {
                    setCropToDelete(crop);
                  }}
                />
              </ListItem>
            ))}
          </ScrollView>
        )}
      </ScrollView>
      {isAddingCrops && (
        <AddCropsDialog
          onClose={() => {
            setIsAddingCrops(false);
          }}
          onBackdropPress={() => {
            if (currentUser.Organization.hasSetupCrops) {
              setIsAddingCrops(false);
            }
          }}
          refetchCrops={refetchOrgCrops}
          onCompleteCropsTutorialStep={completeCropTutorialStep}
        />
      )}
      {selectedCrop && (
        <EditCropDialog
          crop={selectedCrop}
          refetchCrops={refetchOrgCrops}
          onClose={() => {
            setSelectedCrop(undefined);
          }}
          onBackdropPress={() => {
            setSelectedCrop(undefined);
          }}
        />
      )}
      {cropToDelete && (
        <DeleteCropDialog
          crop={cropToDelete}
          onClose={handleCloseDeleteDialog}
          onBackdropPress={handleCloseDeleteDialog}
          refetchCrops={refetchOrgCrops}
        />
      )}
    </SafeAreaView>
  );
};

export default ManageCrops;
