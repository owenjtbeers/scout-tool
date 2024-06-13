import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { CameraCapturedPicture } from "expo-camera";
import { useTheme, FAB, Button } from "@rneui/themed";
import * as MediaLibrary from "expo-media-library";

type DisplayRecentPhotoViewProps = {
  photo: CameraCapturedPicture;
  setPhotoFormValue: (uri: string, asset: MediaLibrary.Asset) => void;
  onClose: () => void;
};

export const DisplayRecentPhotoView: React.FC<DisplayRecentPhotoViewProps> = ({
  photo,
  onClose,
  setPhotoFormValue,
}) => {
  const { theme } = useTheme();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const onAccept = async () => {
    let asset: MediaLibrary.Asset | undefined;
    // 1: Save the photo the the device's gallery after we ask for permission
    if (permissionResponse && permissionResponse.status !== "granted") {
      await requestPermission();
    }
    if (permissionResponse && permissionResponse.status !== "granted") {
      return;
    } else {
      asset = await MediaLibrary.createAssetAsync(photo.uri);
    }
    // 2: Update the form value with the photo's URI
    setPhotoFormValue(photo.uri, asset);
    // 3: Close the photo view
    onClose();
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          height: "85%",
          width: "85%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          contentFit={"contain"}
          source={{ uri: photo.uri }}
          style={styles.photo}
        />
      </View>
      <Button
        containerStyle={styles.button}
        buttonStyle={styles.button}
        title="Accept"
        onPress={onAccept}
      />
      <FAB
        color={theme.colors.primary}
        style={styles.closeButton}
        onPress={onClose}
      >
        <AntDesign name="close" size={24} color="white" />
      </FAB>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  button: {
    flex: 1,
    maxHeight: 100,
    maxWidth: 300,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  closeButton: {},
  closeButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default DisplayRecentPhotoView;
