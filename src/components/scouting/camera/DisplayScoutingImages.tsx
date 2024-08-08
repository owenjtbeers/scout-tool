import React from "react";
import { View, Dimensions, StyleSheet, ScrollView } from "react-native";
import { Image } from "expo-image";
import { ScoutingImage } from "../../../redux/scouting/types";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { FAB, useTheme, Dialog, Text, Button } from "@rneui/themed";
import * as MediaLibrary from "expo-media-library";
import { AntDesign } from "@expo/vector-icons";
import { UseFormGetValues, UseFormSetValue, set } from "react-hook-form";
import { ErrorMessage } from "../../../forms/components/ErrorMessage";
import { ScoutingReportForm } from "../types";

interface DisplayScoutingImagesProps {
  scoutingImages: ScoutingImage[];
  formSetValue: UseFormSetValue<ScoutingReportForm>;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
  onClose: () => void;
}

const DisplayScoutingImages = (props: DisplayScoutingImagesProps) => {
  const { scoutingImages, onClose, formSetValue, formGetValues } = props;
  const { theme } = useTheme();
  const [error, setError] = React.useState<string | null>(null);
  const ref = React.useRef<ICarouselInstance>(null);
  const { width, height } = Dimensions.get("window");

  const removeImage = async (scoutingImage: ScoutingImage) => {
    setError(null);
    const fullListOfImages = formGetValues("images");
    // Remove image from Form
    formSetValue(
      "images",
      fullListOfImages.filter((img) => img.Url !== scoutingImage.Url)
    );
    // Check if image is a local image
    if (scoutingImage.asset && scoutingImage.asset.id) {
      // Delete image from MediaLibrary
      const success = await MediaLibrary.deleteAssetsAsync([
        scoutingImage.asset.id,
      ]);
      console.log("Delete success", success);
    }
  };
  return (
    <Dialog isVisible={true} onBackdropPress={onClose}>
      <Dialog.Title title="Report Images" />
      {error && <ErrorMessage message={error} />}
      <View style={{ height: height / 2, width: width / 2, margin: "auto" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>{`${scoutingImages.length} Images`}</Text>
          <Button
            title={"Close"}
            color={theme.colors.primary}
            style={{}}
            onPress={onClose}
          >
            {/* <Text>Close</Text> */}
          </Button>
        </View>
        <Carousel
          ref={ref}
          width={width / 2}
          height={height / 2}
          data={scoutingImages}
          style={{}}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1 }}>
              <Image
                contentFit="contain"
                source={{ uri: item.Url }}
                style={styles.image}
                cachePolicy={"memory-disk"}
              />
              <Button
                title={"Delete Image from Report"}
                onPress={() => removeImage(item)}
              />
              <FAB style={{ position: "absolute", top: 50 }}>
                <Text>{index + 1}</Text>
              </FAB>
            </View>
          )}
        />
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },
});

export default DisplayScoutingImages;
