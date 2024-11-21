import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Text, ListItem, useTheme, Dialog, Input } from "@rneui/themed";
import {
  useGetGrowersQuery,
  useGetFarmsQuery,
  useCreateFarmMutation,
  useCreateGrowerMutation,
  useEditGrowerMutation,
} from "../../redux/field-management/fieldManagementApi";
import { useRouter } from "expo-router";
import { ScrollView, RefreshControl, Alert } from "react-native";
import { Grower, Farm } from "../../redux/field-management/types";
import { useForm, Controller, set } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { HOME_SETTINGS_SCREEN } from "../../navigation/screens";
import { useUpdateTutorialProgressMutation } from "../../redux/user/userApi";


export const ManageGrowers: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const {
    data: growerData,
    error: growerError,
    isLoading: isLoadingGrowers,
    refetch: refetchGrowers,
    isFetching: isFetchingGrowers,
  } = useGetGrowersQuery("default");

  const {
    data: farmData,
    error: farmError,
    isLoading: isLoadingFarms,
    refetch: refetchFarms,
    isFetching: isFetchingFarms,
  } = useGetFarmsQuery("default");
  
  const [selectedGrower, setSelectedGrower] = React.useState<Grower>();
  const [isAddingGrower, setIsAddingGrower] = React.useState(false || !currentUser?.Organization?.hasSetupGrower);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push(HOME_SETTINGS_SCREEN)
    }

  };

  return (
    <SafeAreaView>
      <Button title={"Back"} onPress={handleBack} />
      <Button
        title={"Add Grower"}
        icon={{ name: "add", size: 24, color: theme.colors.secondary }}
        onPress={() => {
          setIsAddingGrower(true);
        }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={
              isFetchingGrowers ||
              isLoadingGrowers ||
              isFetchingFarms ||
              isLoadingFarms
            }
            onRefresh={() => {
              refetchGrowers();
              refetchFarms();
            }}
          />
        }
      >
        {selectedGrower && (
          <ManageSingleGrowerDialog
            grower={selectedGrower}
            farmData={farmData as Farm[]}
            onClose={() => setSelectedGrower(undefined)}
          />
        )}
        {isAddingGrower && (
          <AddSingleGrowerDialog
            refetchFarms={refetchFarms}
            onClose={() => setIsAddingGrower(false)}
          />
        )}
        {!!growerError && <Text>Error fetching growers</Text>}
        {growerData?.map((grower) => (
          <ListItem
            containerStyle={{
              maxHeight: 150,
            }}
            bottomDivider
            key={`grower-${grower.ID}`}
          >
            <ListItem.Content style={{ flex: 1, flexDirection: "column" }}>
              <ListItem.Title>{grower.Name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron
              size={50}
              color={theme.colors.secondary}
              backgroundColor={theme.colors.primary}
              onPress={() => {
                setSelectedGrower(grower);
              }}
            />
          </ListItem>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

interface ManageSingleGrowerDialogProps {
  grower: Grower;
  farmData: Farm[];
  onClose: () => void;
}
const ManageSingleGrowerDialog = (props: ManageSingleGrowerDialogProps) => {
  const { grower, farmData, onClose } = props;
  const { theme } = useTheme();
  const defaultFormValues = {
    ID: grower.ID,
    Name: grower.Name,
    Email: grower.Email,
    existingFarms: farmData.filter((farm) => farm.GrowerId === grower.ID),
    newFarms: [] as Farm[],
  };
  const [createFarm] = useCreateFarmMutation();
  const [editGrower] = useEditGrowerMutation();
  const { handleSubmit, getValues, setValue, watch, control } = useForm({
    defaultValues: defaultFormValues,
  });
  watch("newFarms");
  return (
    <Dialog isVisible={true} onBackdropPress={onClose}>
      <Dialog.Title title={grower.Name} />
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <Input
            placeholder="Enter Grower Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            label={"Grower Email"}
            errorMessage={error?.message}
          // style={scoutFormStyles.largeTextInput}
          />
        )}
        name={`Email`}
        rules={{
          minLength: {
            value: 2,
            message: "Must be at least three characters long",
          },
        }}
        defaultValue=""
      />
      <Button
        title="Add Farm"
        icon={{ name: "add", size: 24, color: theme.colors.secondary }}
        onPress={() => {
          setValue("newFarms", [
            ...getValues("newFarms"),
            { Name: "", GrowerId: grower.ID, ID: 0 },
          ]);
        }}
      />
      <ScrollView>
        {getValues("newFarms").map((farm, index) => (
          <ListItem key={`farm-${index}`}>
            <ListItem.Content>
              <Controller
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <Input
                    placeholder="Enter Farm Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    label={"Farm Name"}
                    errorMessage={error?.message}
                  // style={scoutFormStyles.largeTextInput}
                  />
                )}
                name={`newFarms.${index}.Name`}
                rules={{
                  required: "Farm Name is required",
                  minLength: {
                    value: 2,
                    message: "Must be at least three characters long",
                  },
                }}
                defaultValue=""
              />
            </ListItem.Content>
            {/*TODO: Add ability to delete farms */}
            {farm.ID === 0 && (
              <Button
                icon={{
                  name: "remove",
                  size: 28,
                  color: theme.colors.secondary,
                }}
                onPress={() => {
                  setValue(
                    "newFarms",
                    getValues("newFarms").filter((farm, i) => i !== index)
                  );
                }}
              />
            )}
          </ListItem>
        ))}
        {getValues("existingFarms").map((farm, index) => (
          <ListItem key={`farm-${index}`}>
            <ListItem.Content>
              <Text>{farm.Name}</Text>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
      <Button
        title="Save"
        onPress={handleSubmit(
          async (data) => {
            // Save Farms
            const newFarms = data.newFarms;
            const result = [] as { error: unknown }[];
            const newFarmRequests = newFarms.map(async (farm) => {
              const response = await createFarm(farm);
              if (response.error) {
                result.push({ error: response.error });
              }
            });
            await Promise.all(newFarmRequests);
            const editGrowerResponse = await editGrower({
              ID: data.ID,
              Name: data.Name,
              Email: data.Email,
            } as Grower);
            const isError = result.find((r) => r.error);
            if (isError || editGrowerResponse.error) {
              Alert.alert("Error saving grower / farms");
            }
            // Close Dialog
            onClose();
          },
          () => { }
        )}
      />
    </Dialog>
  );
};

interface AddSingleGrowerDialogProps {
  onClose: () => void;
  refetchFarms: () => void;
}

interface GrowerForm {
  Name: string;
  Email: string;
  ID: number;
  Farm: { Name: string; ID: number; GrowerId: number };
}
const AddSingleGrowerDialog = (props: AddSingleGrowerDialogProps) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const [updateTutorialProgress] = useUpdateTutorialProgressMutation()
  const { onClose, refetchFarms } = props;
  const { theme } = useTheme();
  const defaultFormValues = {
    Name: "",
    Email: "",
    ID: 0,
    Farm: { Name: "", ID: 0, GrowerId: 0 },
  };
  const [createGrower] = useCreateGrowerMutation();
  const { handleSubmit, control } = useForm<GrowerForm>({
    defaultValues: defaultFormValues,
  });
  const onValidSubmit = async (data: GrowerForm) => {
    const response = await createGrower(data);
    if (response.error) {
      Alert.alert("Error saving grower");
    } else {
      // Update Organization hasSetupGrower
      // TODO: Specify this functionality
      const setupResponse = await updateTutorialProgress({ hasSetupGrower: true })
    }
    refetchFarms();
    onClose();
  };
  return (
    <Dialog isVisible={true} onBackdropPress={props.onClose}>
      <Dialog.Title title={"Add Grower"} />
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <Input
            placeholder="Enter Grower Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            label={"* Grower Name"}
            errorMessage={error?.message}
          // style={scoutFormStyles.largeTextInput}
          />
        )}
        name={`Name`}
        rules={{
          required: "Grower Name is required",
          minLength: {
            value: 2,
            message: "Must be at least three characters long",
          },
        }}
        defaultValue=""
      />
      <Text>
        A new grower requires at least one farm to be created. You can add more
        farms later
      </Text>
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <Input
            placeholder="Enter Farm Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            label={"* Farm Name"}
            errorMessage={error?.message}
          // style={scoutFormStyles.largeTextInput}
          />
        )}
        name={`Farm.Name`}
        rules={{
          required: "Farm Name is required",
          minLength: {
            value: 2,
            message: "Must be at least three characters long",
          },
        }}
        defaultValue=""
      />
      <Text>
        A growers email will be used to autofill as a recipient for scouting
        reports
      </Text>
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <Input
            placeholder="Enter Grower Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            label={"Grower Email"}
            errorMessage={error?.message}
          // style={scoutFormStyles.largeTextInput}
          />
        )}
        name={`Email`}
        rules={{
          required: false,
          minLength: {
            value: 2,
            message: "Must be at least three characters long",
          },
        }}
        defaultValue=""
      />
      <Dialog.Actions>
        <Button title="Save" onPress={handleSubmit(onValidSubmit, () => { })} />
      </Dialog.Actions>
    </Dialog>
  );
};
export default ManageGrowers;
