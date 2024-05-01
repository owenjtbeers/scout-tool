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
import { useDispatch } from "react-redux";
import { scoutFormStyles } from "./styles";
import { useGetOrgWeedsQuery } from "../../../redux/scouting/scoutingApi";
import type { Field } from "../../../redux/fields/types";
import type { ScoutingReportForm } from "../types";
import GeneralQuestionPrompt from "./GeneralQuestionPrompt";
import {
  getNewWeedObservationSet,
  getNumberOfObservationsFromScoutingArea,
  getRecentAliasesFromObservations,
} from "./scoutReportUtils";
import type { IQuestion } from "./Question";
import { AliasGrouping } from "./AliasGrouping";

interface ScoutingReportObservationContentProps {
  field: Field;
  scoutingAreaFormIndex: number;
  formControl: Control<ScoutingReportForm>;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
  formSetValue: UseFormSetValue<ScoutingReportForm>;
  watch: UseFormWatch<ScoutingReportForm>;
  setSideSheetContentType: (contentType: "summary" | "observation") => void;
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
  } = props;
  const { theme } = useTheme();
  const { data: orgWeeds, isLoading: isLoadingOrgWeeds } = useGetOrgWeedsQuery(
    {},
    { refetchOnReconnect: true }
  );
  const scoutingAreas = formGetValues(`scoutingAreas`);
  const scoutingArea = watch(`scoutingAreas.${scoutingAreaFormIndex}`);

  const handleSubmit = () => {
    setSideSheetContentType("summary");
  };
  const orgWeedPicklist = orgWeeds?.data?.map(
    (orgWeed) => orgWeed?.WeedAlias?.Name || ""
  );
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
            <GeneralQuestionPrompt
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
                    ...getNewWeedObservationSet(alias),
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
                />
              )}
              name={`scoutingAreas.${scoutingAreaFormIndex}.WeedObservations`}
            />

            {/* <GeneralQuestionPrompt
            type={"Pest"}
            picklist={["Pest 1", "Pest 2", "Pest 3"]}
            isLoadingPicklist={false}
            createQuestion={(alias) => {}}
          />
          <GeneralQuestionPrompt
            type={"Disease"}
            isLoadingPicklist={false}
            picklist={["Disease 1", "Disease 2", "Disease 3"]}
            createQuestion={(question) => {
              return;
            }}
          /> */}
          </View>
          <Button
            style={{ marginBottom: 1000 }}
            title={"FINISH WITH OBSERVATIONS FOR AREA"}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </View>
  );
};
