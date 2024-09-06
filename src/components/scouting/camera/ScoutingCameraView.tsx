import React, { useEffect, useState } from "react";
import { Button, Text, useTheme, FAB } from "@rneui/themed";
import {
  CameraCapturedPicture,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { UseFormSetValue, UseFormGetValues, set } from "react-hook-form";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import { ScoutingReportForm } from "../types";
import { DisplayRecentPhotoView } from "./DisplayRecentPhotoView";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { ScoutingImage } from "../../../redux/scouting/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Asset } from "expo-media-library";
import { setPhotoFormValue } from "./utils";

interface ScoutingCameraViewProps {
  setIsTakingPhoto: (isTakingPhoto: boolean) => void;
  photoMetadata: ScoutingImage | null;
  setPhotoMetadata: (metadata: ScoutingImage | null) => void;
  // formControl: any;
  pathToFormValue: string;
  formSetValue: UseFormSetValue<ScoutingReportForm>;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
}

export function ScoutingCameraView(props: ScoutingCameraViewProps) {
  const {
    setIsTakingPhoto,
    formSetValue,
    pathToFormValue,
    photoMetadata,
    formGetValues,
  } = props;
  const { theme } = useTheme();
  const cameraRef = React.useRef<CameraView>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [currentPhoto, setCurrentPhoto] =
    useState<CameraCapturedPicture | null>(null);

  useEffect(() => {
    (async () => {
      if (!!permission && !permission.granted) {
        await requestPermission();
      }
    })();
  }, [permission]);

  if (!permission) {
    // Camera permissions are still loading.
    return <ActivityIndicator size={"large"} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button
          style={styles.button}
          onPress={requestPermission}
          title="grant permission"
        />
        <Button
          onPress={() => {
            setIsTakingPhoto(false);
          }}
          title="Cancel"
        />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.5 });
    if (photo) {
      // formSetValue(pathToFormValue, photo.uri);
      // setIsTakingPhoto(false);
      setCurrentPhoto(photo);
    } else {
      Alert.alert("Failed to take picture");
    }
  }
  if (!!currentPhoto) {
    return (
      <DisplayRecentPhotoView
        photo={currentPhoto}
        setPhotoFormValue={setPhotoFormValue(
          formGetValues,
          formSetValue,
          photoMetadata
        )}
        onClose={() => {
          setCurrentPhoto(null);
          setIsTakingPhoto(false);
        }}
      />
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 100,
            // maxWidth: 300,
            // maxHeight: 200,
          }}
        >
          <Button
            containerStyle={styles.button}
            buttonStyle={styles.button}
            onPress={takePicture}
            title={"Take Picture"}
            icon={
              <Entypo
                name="camera"
                style={styles.iconStyle}
                size={24}
                color="white"
              />
            }
          />
          <TouchableOpacity onPress={toggleCameraFacing}>
            <MaterialIcons
              style={styles.iconStyle}
              name="flip-camera-ios"
              size={48}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </CameraView>
      <FAB
        color={theme.colors.primary}
        style={styles.closeButton}
        onPress={() => setIsTakingPhoto(false)}
      >
        <Entypo name="cross" size={24} color="white" />
      </FAB>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  iconStyle: {
    paddingRight: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    // margin: 64,
  },
  button: {
    flex: 1,
    maxHeight: 100,
    maxWidth: 300,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    position: "absolute",
    top: 56,
    right: 16,
  },
});
