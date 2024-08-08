import React from "react";
import { View, Alert } from "react-native";
import { scoutFormStyles } from "./styles";
import { useTheme, Text, Button } from "@rneui/themed";
import { Ionicons, Entypo } from "@expo/vector-icons";
import type {
  Observation,
  ObservationTypePrefix,
  ScoutingArea,
  ScoutingImage,
} from "../../../redux/scouting/types";
import type {
  Control,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { createScoutingImageMetadata } from "../utils/scoutReportUtils";
import type { ScoutingReportForm } from "../types";
import { Question } from "./Question";
import DisplayScoutingImages from "../camera/DisplayScoutingImages";
interface AliasGroupingProps {
  observations: Observation[];
  formControl: Control<ScoutingReportForm>;
  formSetValue: UseFormSetValue<ScoutingReportForm>;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
  scoutingAreaFormIndex: number;
  observationTypeFormPrefix: ObservationTypePrefix;
  setIsTakingPhoto: (isTakingPhoto: boolean) => void;
  setPhotoMetadata: (metadata: ScoutingImage) => void;
  watch: UseFormWatch<ScoutingReportForm>;
}

interface ObservationWithFormIndex extends Observation {
  formIndex: number;
}
export const AliasGrouping = (props: AliasGroupingProps) => {
  const {
    observations,
    formControl,
    formSetValue,
    formGetValues,
    scoutingAreaFormIndex,
    observationTypeFormPrefix,
    setIsTakingPhoto,
    setPhotoMetadata,
    watch,
  } = props;
  const { theme } = useTheme();
  const [isViewingImages, setIsViewingImages] = React.useState(false);
  if (observations && observations.length === 0) {
    return null;
  }
  const images = watch(`images`);
  const aliasGroupings = observations.reduce((acc, observation, formIndex) => {
    const { Alias } = observation;
    if (!Alias) {
      return acc;
    }
    if (!acc[Alias.Name]) {
      acc[Alias.Name] = [];
    }
    acc[Alias.Name].push({ ...observation, formIndex });
    return acc;
  }, {} as Record<string, ObservationWithFormIndex[]>);

  const getImagesForAlias = (
    alias: { ID: number; Name: string },
    scoutingArea: ScoutingArea
  ) =>
    images.filter(
      (image) =>
        ((image.ObservationAreaUid === scoutingArea.UId ||
          image.ObservationAreaId === scoutingArea.ID) &&
          (image?.WeedAlias?.Name === alias?.Name ||
            image?.DiseaseAlias?.Name === alias?.Name ||
            image?.InsectAlias?.Name === alias?.Name)) ||
        (image?.Type === observationTypeFormPrefix &&
          (image?.WeedAliasId === alias.ID ||
            image?.DiseaseAliasId === alias.ID ||
            image?.InsectAliasId === alias.ID))
    );
  const scoutingArea = formGetValues(`scoutingAreas.${scoutingAreaFormIndex}`);
  return (
    <>
      {Object.keys(aliasGroupings).map((aliasName) => {
        const aliasImages = getImagesForAlias(
          aliasGroupings[aliasName][0].Alias,
          scoutingArea
        );
        return (
          <View key={aliasName} style={scoutFormStyles.section}>
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <Text>{aliasName}</Text>
              <Ionicons
                name="remove-circle"
                size={20}
                color={theme.colors.primary}
                onPress={() =>
                  Alert.alert(
                    "Discard Changes?",
                    `Are you sure you want to discard observations for ${aliasName}?`,
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Discard",
                        onPress: () => {
                          const observations = formGetValues(
                            `scoutingAreas.${scoutingAreaFormIndex}.${observationTypeFormPrefix}Observations`
                          );
                          formSetValue(
                            `scoutingAreas.${scoutingAreaFormIndex}.${observationTypeFormPrefix}Observations`,
                            observations.filter(
                              (obs: any) => obs.Alias.Name !== aliasName
                            )
                          );
                        },
                      },
                    ]
                  )
                }
              />
            </View>
            {aliasGroupings[aliasName].map((observation, index) => {
              return (
                <Question
                  key={`${aliasName}-observation-${index}`}
                  observation={observation}
                  formControl={formControl}
                  formValueName={`scoutingAreas.${scoutingAreaFormIndex}.${observationTypeFormPrefix}Observations.${observation.formIndex}.value`}
                />
              );
            })}
            {aliasImages?.length ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 10,
                }}
              >
                <Text>{`${aliasImages.length} images`}</Text>
                <Button
                  title={"View Images"}
                  icon={<Entypo name="image" color={theme.colors.secondary} />}
                  onPress={() => setIsViewingImages(true)}
                />
              </View>
            ) : null}
            {isViewingImages && (
              <DisplayScoutingImages
                scoutingImages={aliasImages}
                formGetValues={formGetValues}
                formSetValue={formSetValue}
                onClose={() => setIsViewingImages(false)}
              />
            )}
            <Button
              icon={<Entypo name="camera" color={theme.colors.secondary} />}
              onPress={() => {
                const scoutingArea = formGetValues(
                  `scoutingAreas.${scoutingAreaFormIndex}`
                );
                const alias = aliasGroupings[aliasName][0].Alias;
                setPhotoMetadata(
                  createScoutingImageMetadata(
                    scoutingArea,
                    observationTypeFormPrefix,
                    alias,
                    undefined
                  )
                );
                setIsTakingPhoto(true);
              }}
            >
              Take Photo
            </Button>
          </View>
        );
      })}
    </>
  );
};
