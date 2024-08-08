import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Input, Text, ButtonGroup } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import {
  Controller,
  UseFormGetValues,
  Control,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { scoutFormStyles } from "./styles";
import {
  useGetOrgWeedsQuery,
  useGetOrgDiseasesQuery,
  useGetOrgInsectsQuery,
} from "../../../redux/scouting/scoutingApi";
import type { Field } from "../../../redux/fields/types";
import type { ScoutingReportForm } from "../types";
import AliasQuestionPrompt from "./AliasQuestionPrompt";
import {
  getNewWeedObservationSet,
  getNewDiseaseObservationSet,
  getNewInsectObservationSet,
  getNewGeneralObservation,
  getNumberOfObservationsFromScoutingArea,
  getRecentAliasesFromObservations,
} from "../utils/scoutReportUtils";
import { AliasGrouping } from "./AliasGrouping";
import { ScoutingImage, Alias } from "../../../redux/scouting/types";
import GeneralQuestionPrompt from "./GeneralQuestionPrompt";

interface ScoutingReportObservationContentProps {
  field: Field;
  scoutingAreaFormIndex: number;
  formControl: Control<ScoutingReportForm>;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
  formSetValue: UseFormSetValue<ScoutingReportForm>;
  watch: UseFormWatch<ScoutingReportForm>;
  setSideSheetContentType: (contentType: "summary" | "observation") => void;
  setPhotoMetadata: (metadata: ScoutingImage) => void;
  setIsTakingPhoto: (isTakingPhoto: boolean) => void;
}
export const ScoutingReportObservationContent = (
  props: ScoutingReportObservationContentProps
) => {
  const {
    field,
    formControl,
    formGetValues,
    formSetValue,
    watch,
    scoutingAreaFormIndex,
    setSideSheetContentType,
    setPhotoMetadata,
    setIsTakingPhoto,
  } = props;
  const { theme } = useTheme();
  const { data: orgWeeds, isLoading: isLoadingOrgWeeds } = useGetOrgWeedsQuery(
    {},
    { refetchOnReconnect: true }
  );
  const { data: orgDiseases, isLoading: isLoadingOrgDiseases } =
    useGetOrgDiseasesQuery({}, { refetchOnReconnect: true });
  const { data: orgInsects, isLoading: isLoadingOrgInsects } =
    useGetOrgInsectsQuery({}, { refetchOnReconnect: true });

  const scoutingAreas = formGetValues(`scoutingAreas`);
  const scoutingArea = watch(`scoutingAreas.${scoutingAreaFormIndex}`);

  const handleSubmit = () => {
    setSideSheetContentType("summary");
  };
  // const recentWeeds = scoutingArea?.weedObservations?.filter()
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          // ...scoutFormStyles.page,
          backgroundColor: theme.colors.grey0,
          // marginBottom: 1000,
        }}
      >
        <View style={scoutFormStyles.page}>
          <View
            key={"section-observation-info"}
            style={scoutFormStyles.section}
          >
            {/* Section for Field information, selected field name, crop info, previous crops, current date */}

            <Text>
              # of Observations:{" "}
              {getNumberOfObservationsFromScoutingArea(scoutingArea)}
            </Text>
          </View>
          <View key={"section-observation-questions"}>
            <AliasQuestionPrompt
              type={"Weed"}
              recentlyObserved={getRecentAliasesFromObservations(
                scoutingAreas,
                "Weed"
              )}
              getAddedAliases={() => {
                const weedObservations = formGetValues(
                  `scoutingAreas.${scoutingAreaFormIndex}.WeedObservations`
                );
                if (weedObservations) {
                  return weedObservations.map((obs) => obs.Alias);
                }
                return [];
              }}
              picklist={
                orgWeeds?.data?.map((orgWeed) => ({
                  ID: orgWeed.WeedAliasId,
                  Name: orgWeed?.WeedAlias?.Name || "",
                })) || []
              }
              isLoadingPicklist={isLoadingOrgWeeds}
              createQuestion={(alias) => {
                const weedObservations = formGetValues(
                  `scoutingAreas.${scoutingAreaFormIndex}.WeedObservations`
                );
                if (weedObservations) {
                  const newWeedObservations = [
                    ...weedObservations,
                    ...getNewWeedObservationSet(alias as Alias),
                  ];
                  formSetValue(
                    `scoutingAreas.${scoutingAreaFormIndex}.WeedObservations`,
                    newWeedObservations
                  );
                }
              }}
            />
            <Controller
              control={formControl}
              render={({ field: { value } }) => (
                <AliasGrouping
                  observationTypeFormPrefix={"Weed"}
                  formControl={formControl}
                  formGetValues={formGetValues}
                  formSetValue={formSetValue}
                  scoutingAreaFormIndex={scoutingAreaFormIndex}
                  observations={value}
                  setIsTakingPhoto={setIsTakingPhoto}
                  setPhotoMetadata={setPhotoMetadata}
                  watch={watch}
                />
              )}
              name={`scoutingAreas.${scoutingAreaFormIndex}.WeedObservations`}
            />
            <AliasQuestionPrompt
              type={"Insect"}
              recentlyObserved={getRecentAliasesFromObservations(
                scoutingAreas,
                "Insect"
              )}
              getAddedAliases={() => {
                const insectObservations = formGetValues(
                  `scoutingAreas.${scoutingAreaFormIndex}.InsectObservations`
                );
                if (insectObservations) {
                  return insectObservations.map((obs) => obs.Alias);
                }
                return [];
              }}
              picklist={
                orgInsects?.data?.map((orgInsect) => ({
                  ID: orgInsect.InsectAliasId,
                  Name: orgInsect?.InsectAlias?.Name || "",
                })) || []
              }
              isLoadingPicklist={isLoadingOrgInsects}
              createQuestion={(alias) => {
                const insectObservations = formGetValues(
                  `scoutingAreas.${scoutingAreaFormIndex}.InsectObservations`
                );
                if (insectObservations) {
                  const newInsectObservations = [
                    ...insectObservations,
                    ...getNewInsectObservationSet(alias as Alias),
                  ];
                  formSetValue(
                    `scoutingAreas.${scoutingAreaFormIndex}.InsectObservations`,
                    newInsectObservations
                  );
                }
              }}
            />
            <Controller
              control={formControl}
              render={({ field: { value } }) => (
                <AliasGrouping
                  observationTypeFormPrefix={"Insect"}
                  formControl={formControl}
                  formGetValues={formGetValues}
                  formSetValue={formSetValue}
                  scoutingAreaFormIndex={scoutingAreaFormIndex}
                  observations={value}
                  setIsTakingPhoto={setIsTakingPhoto}
                  setPhotoMetadata={setPhotoMetadata}
                  watch={watch}
                />
              )}
              name={`scoutingAreas.${scoutingAreaFormIndex}.InsectObservations`}
            />
            <AliasQuestionPrompt
              type={"Disease"}
              recentlyObserved={getRecentAliasesFromObservations(
                scoutingAreas,
                "Disease"
              )}
              getAddedAliases={() => {
                const diseaseObservations = formGetValues(
                  `scoutingAreas.${scoutingAreaFormIndex}.DiseaseObservations`
                );
                if (diseaseObservations) {
                  return diseaseObservations.map((obs) => obs.Alias);
                }
                return [];
              }}
              picklist={
                orgDiseases?.data?.map((orgDisease) => ({
                  ID: orgDisease.DiseaseAliasId,
                  Name: orgDisease?.DiseaseAlias?.Name || "",
                })) || []
              }
              isLoadingPicklist={isLoadingOrgDiseases}
              createQuestion={(alias) => {
                const DiseaseObservations = formGetValues(
                  `scoutingAreas.${scoutingAreaFormIndex}.DiseaseObservations`
                );
                if (DiseaseObservations) {
                  const newDiseaseObservations = [
                    ...DiseaseObservations,
                    ...getNewDiseaseObservationSet(alias as Alias),
                  ];
                  formSetValue(
                    `scoutingAreas.${scoutingAreaFormIndex}.DiseaseObservations`,
                    newDiseaseObservations
                  );
                }
              }}
            />
            <Controller
              control={formControl}
              render={({ field: { value } }) => (
                <AliasGrouping
                  observationTypeFormPrefix={"Disease"}
                  formControl={formControl}
                  formGetValues={formGetValues}
                  formSetValue={formSetValue}
                  scoutingAreaFormIndex={scoutingAreaFormIndex}
                  observations={value}
                  setIsTakingPhoto={setIsTakingPhoto}
                  setPhotoMetadata={setPhotoMetadata}
                  watch={watch}
                />
              )}
              name={`scoutingAreas.${scoutingAreaFormIndex}.DiseaseObservations`}
            />
            <Controller
              control={formControl}
              render={({ field: { value } }) => (
                <AliasGrouping
                  observationTypeFormPrefix={"General"}
                  formControl={formControl}
                  formGetValues={formGetValues}
                  formSetValue={formSetValue}
                  scoutingAreaFormIndex={scoutingAreaFormIndex}
                  observations={value}
                  setIsTakingPhoto={setIsTakingPhoto}
                  setPhotoMetadata={setPhotoMetadata}
                  watch={watch}
                />
              )}
              name={`scoutingAreas.${scoutingAreaFormIndex}.GeneralObservations`}
            />
            <GeneralQuestionPrompt
              type="General"
              recentlyObserved={getRecentAliasesFromObservations(
                scoutingAreas,
                "General"
              )}
              createQuestion={(questionName: string) => {
                const GeneralObservations = formGetValues(
                  `scoutingAreas.${scoutingAreaFormIndex}.GeneralObservations`
                );
                if (GeneralObservations) {
                  const newGeneralObservations = [
                    ...GeneralObservations,
                    getNewGeneralObservation(questionName),
                  ];
                  formSetValue(
                    `scoutingAreas.${scoutingAreaFormIndex}.GeneralObservations`,
                    newGeneralObservations
                  );
                }
              }}
              getAddedGeneralQuestionsForArea={() => {
                const generalObservations = formGetValues(
                  `scoutingAreas.${scoutingAreaFormIndex}.GeneralObservations`
                );
                if (generalObservations) {
                  return generalObservations.map((obs) => obs.name);
                }
                return [];
              }}
            />
          </View>
          <Button
            title={"FINISH WITH OBSERVATIONS FOR AREA"}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </View>
  );
};
