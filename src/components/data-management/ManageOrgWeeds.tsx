import React from "react";
import { View, FlatList, Text, StyleSheet, RefreshControl } from "react-native";
import { ListItem, Button, useTheme, Dialog, Input } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetOrgWeedsQuery,
  useCreateOrgWeedMutation,
} from "../../redux/scouting/scoutingApi";
import { RootState } from "../../redux/store";
import { useRouter } from "expo-router";
import { SETTINGS_MANAGE_PESTS_SCREEN } from "../../navigation/screens";
import { OrgWeed } from "../../redux/scouting/types";
import { Controller, useForm } from "react-hook-form";
import { getErrorMessage } from "../../utils/errors";

const ManageOrgWeeds: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const {
    data: weedsData,
    isLoading,
    refetch,
    error,
  } = useGetOrgWeedsQuery({}, { refetchOnReconnect: true });

  const userState = useSelector((state: RootState) => state.user);
  const [isAddingOrgWeed, setIsAddingOrgWeed] = React.useState(false);
  const handleBack = () => {
    router.navigate(SETTINGS_MANAGE_PESTS_SCREEN);
  };
  const onCloseAddDialog = () => {
    setIsAddingOrgWeed(false);
  };
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {getErrorMessage(error)}</Text>
      </View>
    );
  }

  if (!weedsData) {
    return (
      <View style={styles.container}>
        <Text>No data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 16,
          alignItems: "center",
        }}
      >
        <Button title={"Back"} onPress={handleBack} />
        <Button
          title={"Add Organization Weed"}
          icon={{ name: "add", size: 24, color: theme.colors.secondary }}
          onPress={() => {
            setIsAddingOrgWeed(true);
          }}
        />
      </View>
      <FlatList
        data={weedsData.data}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.WeedAlias?.Name}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />
      <Dialog
        isVisible={isAddingOrgWeed}
        onDismiss={onCloseAddDialog}
        onBackdropPress={onCloseAddDialog}
      >
        <AddOrganizationWeedForm onClose={onCloseAddDialog} />
      </Dialog>
      {/* <Dialog
        isVisible={!!selectedOrgWeed}
        onDismiss={() => setSelectedOrgWeed(null)}
      >
        <EditOrganizationWeedForm orgWeed={selectedOrgWeed} />
      </Dialog> */}
    </View>
  );
};

interface AddOrganizationWeedFormProps {
  onClose: () => void;
}
const AddOrganizationWeedForm: React.FC<AddOrganizationWeedFormProps> = (
  props
) => {
  const { onClose } = props;
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [createOrganizationWeed, { error }] = useCreateOrgWeedMutation();
  const defaultValues: OrgWeed = {
    ID: 0,
    WeedAlias: {
      ID: 0,
      Name: "",
    },
    WeedId: 0,
    WeedAliasId: 0,
    AddedById: 0,
  };

  const { control, handleSubmit } = useForm<OrgWeed>({
    defaultValues,
  });
  return (
    <View>
      <Dialog.Title title={"Add Organization Weed"} />
      <View style={styles.container}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              label={"* Weed Name"}
              onChangeText={onChange}
              value={value}
              placeholder={"Weed Alias"}
            />
          )}
          name={"WeedAlias.Name"}
          rules={{ required: "Name is required" }}
        />
        <Button
          title={"Add"}
          onPress={handleSubmit(async (data) => {
            const response = await createOrganizationWeed(data);
            if (response.error) {
              return;
            } else {
              onClose();
            }
          })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default ManageOrgWeeds;
