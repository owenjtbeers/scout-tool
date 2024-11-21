import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, ListItem, useTheme, Dialog, Input } from "@rneui/themed";
import { useRouter, useNavigation } from "expo-router";
import { ScrollView, RefreshControl } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { HOME_SETTINGS_SCREEN } from "../../navigation/screens";
import alert from "../polyfill/Alert";
import {
  useGetOrgCropsQuery,
  useGetGenericCropListQuery,
  // useCreateCropMutation,
  // useEditCropMutation
} from "../../redux/crops/cropsApi";

interface CropForm {
  ID: number;
  Name: string;
}

interface EditCropDialogProps {
  crop?: { ID: number, Name: string };
  onClose: () => void;
  onBackdropPress: () => void;
}

// const EditCropDialog: React.FC<EditCropDialogProps> = ({ crop, onClose, onBackdropPress }) => {
//   const [editCrop] = useEditCropMutation();
//   const { handleSubmit, control } = useForm<CropForm>({
//     defaultValues: {
//       ID: crop?.ID || 0,
//       Name: crop?.Name || ""
//     }
//   });

//   const onValidSubmit = async (data: CropForm) => {
//     const response = await editCrop(data);
//     if (response.error) {
//       alert("Error saving crop", "");
//     }
//     onClose();
//   };

//   return (
//     <Dialog isVisible={true} onBackdropPress={onBackdropPress}>
//       <Dialog.Title title={crop ? "Edit Crop" : "Add New Crop"} />
//       <Controller
//         control={control}
//         render={({
//           field: { onChange, onBlur, value },
//           fieldState: { error },
//         }) => (
//           <Input
//             placeholder="Enter Crop Name"
//             onBlur={onBlur}
//             onChangeText={onChange}
//             value={value}
//             label="* Crop Name"
//             errorMessage={error?.message}
//           />
//         )}
//         name="Name"
//         rules={{
//           required: "Crop Name is required",
//           minLength: {
//             value: 2,
//             message: "Must be at least two characters long",
//           },
//         }}
//       />
//       <Dialog.Actions>
//         <Button title="Save" onPress={handleSubmit(onValidSubmit)} />
//       </Dialog.Actions>
//     </Dialog>
//   );
// };

export const ManageCrops: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation()
  const { theme } = useTheme();
  const [selectedCrop, setSelectedCrop] = React.useState<{ ID: number, Name: string }>();
  const [isAddingCrop, setIsAddingCrop] = React.useState(false);

  const {
    data: orgCropData,
    isLoading,
    refetch,
    isFetching,
  } = useGetOrgCropsQuery("default");

  const handleBack = () => {
    if (router.canGoBack()) {
      console.log(navigation.getParent())
      router.back();
      return
    } else {
      router.push(HOME_SETTINGS_SCREEN);
      return
    }
  };

  return (
    <SafeAreaView>
      <Button title="Back" onPress={handleBack} />
      <Button
        title="Add Crop"
        icon={{ name: "add", size: 24, color: theme.colors.secondary }}
        onPress={() => setIsAddingCrop(true)}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        {isLoading ? (
          <Text>Loading crops...</Text>
        ) : orgCropData?.data?.length === 0 ? (
          <Text>No crops found. Add a crop to get started.</Text>
        ) : (
          orgCropData?.data?.map((crop) => (
            <ListItem
              key={crop.ID}
              onPress={() => setSelectedCrop(crop)}
            >
              <ListItem.Content>
                <ListItem.Title>{crop.Name}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))
        )}
      </ScrollView>

      {(isAddingCrop || selectedCrop) && (
        null
        // <EditCropDialog
        //   crop={selectedCrop}
        //   onClose={() => {
        //     setSelectedCrop(undefined);
        //     setIsAddingCrop(false);
        //     refetch();
        //   }}
        //   onBackdropPress={() => {
        //     setSelectedCrop(undefined);
        //     setIsAddingCrop(false);
        //   }}
        // />
      )}
    </SafeAreaView>
  );
};

export default ManageCrops;
