import React from "react";
import { View, InputAccessoryView, Platform } from "react-native";
import { Controller, Control } from "react-hook-form";
import { Input, Text, ButtonGroup, Slider } from "@rneui/themed";
import { scoutFormStyles } from "./styles";
import { ScoutingReportForm } from "../types";
import { Observation } from "../../../redux/scouting/types";
import { getDisplayUnit } from "../../../utils/formatting/units";
import { InputWithAccessoryView } from "../../lib/InputWithAccessoryView";

export interface IQuestion {
  observation: Observation;
}

interface QuestionProps extends IQuestion {
  formControl: Control<ScoutingReportForm>;
  formValueName: any; // TODO: Fix this type
}

export const Question = (props: QuestionProps) => {
  const { observation, formControl, formValueName } = props;
  const {
    questionType: valueType,
    options,
    valueUnit1,
    valueUnit2,
  } = observation;
  return (
    <View style={{ ...scoutFormStyles.section, flexDirection: "column" }}>
      <Text>{observation.name}</Text>
      {valueType === "numeric" ? (
        <Controller
          control={formControl}
          render={({ field: { onChange, value } }) => (
            <Input
              keyboardType={"numeric"}
              value={value}
              onChangeText={onChange}
              placeholder="Enter number here..."
            />
          )}
          name={formValueName}
        />
      ) : valueType === "text" ? (
        <Controller
          control={formControl}
          render={({ field: { onChange, value, name } }) => (
            <InputWithAccessoryView
              value={value}
              onChangeText={onChange}
              placeholder="Enter text here..."
              inputAccessoryViewID={name}
            />
          )}
          name={formValueName}
        />
      ) : valueType === "multiselect" && options ? (
        <Controller
          control={formControl}
          render={({ field: { onChange, value } }) => (
            <Input value={value} onChangeText={onChange} />
          )}
          name={formValueName}
        />
      ) : valueType === "select" && options?.length ? (
        <Controller
          control={formControl}
          render={({ field: { onChange, value } }) => (
            <ButtonGroup
              selectedIndex={options.findIndex((opt) => opt === value)}
              onPress={(index) => {
                const newVal = options[index] || "";
                onChange(newVal);
              }}
              buttons={options}
            />
          )}
          name={formValueName}
        />
      ) : valueType === "numeric-slider" ? (
        <Controller
          control={formControl}
          render={({ field: { onChange, value } }) => {
            const minValue = Number(options?.[0] || 0);
            const maxValue = Number(options?.[1] || 100);
            // TODO: Make this more intelligent
            const step = maxValue - minValue > 5 ? 1 : 0.25;
            return (
              <>
                <Slider
                  value={value || 0}
                  onValueChange={onChange}
                  minimumValue={Number(options?.[0] || 0)}
                  maximumValue={Number(options?.[1] || 100)}
                  step={step}
                  orientation={"horizontal"}
                />
                <Text>
                  {value}
                  {" " + getDisplayUnit(valueUnit1, valueUnit2)}
                </Text>
              </>
            );
          }}
          name={formValueName}
        />
      ) : null}
    </View>
  );
};
