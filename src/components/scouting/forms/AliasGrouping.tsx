import React from "react";
import { View, Alert } from "react-native";
import { scoutFormStyles } from "./styles";
import { useTheme, Text } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import type { Observation, ObservationTypePrefix } from "../../../redux/scouting/types";
import type {
  Control,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import type { ScoutingReportForm } from "../types";
import { Question } from "./Question";
interface AliasGroupingProps {
  observations: Observation[];
  formControl: Control<ScoutingReportForm>;
  formSetValue: UseFormSetValue<ScoutingReportForm>;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
  scoutingAreaFormIndex: number;
  observationTypeFormPrefix: ObservationTypePrefix;
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
  } = props;
  const { theme } = useTheme();
  if (observations && observations.length === 0) {
    return null;
  }
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
  return (
    <>
      {Object.keys(aliasGroupings).map((aliasName) => {
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
          </View>
        );
      })}
    </>
  );
};
