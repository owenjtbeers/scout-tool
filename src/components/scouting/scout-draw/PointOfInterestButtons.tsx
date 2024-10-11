import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { Button, useTheme, Dialog, ListItem } from "@rneui/themed";
import { scoutDrawStyles as styles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { drawingSlice } from "../../../redux/map/drawingSlice";
import {
  SCOUTING_SLICE_REDUCER_KEY,
  scoutingSlice,
  PestHotButton,
} from "../../../redux/scouting/scoutingSlice";
import { PestIcon } from "../../icons/PestIcon";
import { RootState } from "../../../redux/store";
import { UseFormGetValues } from "react-hook-form";
import { ScoutingReportForm } from "../types";
import {
  ObservationTypePrefix,
  ScoutingArea,
  Observation,
  Alias,
} from "../../../redux/scouting/types";
interface PointOfInterestButtonsProps {
  getFormValues: UseFormGetValues<ScoutingReportForm>;
}

export const PointOfInterestButtons = (props: PointOfInterestButtonsProps) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [hotButtonDialogVisible, setHotButtonDialogVisible] =
    React.useState(false);
  const [settingsDialogVisible, setSettingsDialogVisible] =
    React.useState(false);
  const [dropAtCurrentLocation, setDropAtCurrentLocation] =
    React.useState(false);
  const selectedPestHotButton = useSelector(
    (state: RootState) =>
      state[SCOUTING_SLICE_REDUCER_KEY].selectedPestHotButton
  );
  const selectedPestHotButtonQueue = useSelector(
    (state: RootState) => state[SCOUTING_SLICE_REDUCER_KEY].pestHotButtonsQueue
  );
  const getAliasList = useCallback(() => {
    const fieldScoutingArea = props
      .getFormValues("scoutingAreas")
      .find((area) => area.Type === "Main") as ScoutingArea;
    if (!fieldScoutingArea) {
      return [];
    }
    // Get all unique aliases from the observations on the field.
    // Observations might have the same alias, so we need to filter out duplicates.
    const weedAliases = getUniqueAliasNames(fieldScoutingArea.WeedObservations);
    const diseaseAliases = getUniqueAliasNames(
      fieldScoutingArea.DiseaseObservations
    );
    const insectAliases = getUniqueAliasNames(
      fieldScoutingArea.InsectObservations
    );
    const generalAliases = getUniqueAliasNames(
      fieldScoutingArea.GeneralObservations
    );

    return weedAliases
      .concat(diseaseAliases)
      .concat(insectAliases)
      .concat(generalAliases);
  }, [hotButtonDialogVisible]);
  return (
    <>
      <View style={styles.colorButtonsContainer}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            maxHeight: 100,
            flexWrap: "wrap",
          }}
        >
          {/* <Button
            radius={10}
            containerStyle={styles.pointOfInterestButtonContainer}
            raised
            buttonStyle={styles.button}
            title={selectedPestHotButton?.Alias?.Name || ""}
            iconPosition="top"
            icon={PestIcon({
              type: selectedPestHotButton?.type,
              size: 49,
              color: selectedPestHotButton?.color || theme.colors.secondary,
            })}
          /> */}
          {selectedPestHotButtonQueue?.length
            ? selectedPestHotButtonQueue
                .map((button, index) => (
                  <Button
                    key={index}
                    radius={10}
                    containerStyle={styles.pointOfInterestButtonContainer}
                    raised={isSelectedPestHotButton(
                      selectedPestHotButton,
                      button
                    )}
                    buttonStyle={styles.button}
                    title={button?.Alias?.Name}
                    iconPosition="top"
                    icon={PestIcon({
                      type: button.type,
                      size: 49,
                      color: button.color || theme.colors.secondary,
                    })}
                    onPress={() => {
                      if (
                        !isSelectedPestHotButton(selectedPestHotButton, button)
                      ) {
                        dispatch(
                          scoutingSlice.actions.setPestHotButton({
                            Alias: button.Alias,
                            color: button.color,
                            type: button.type,
                          })
                        );
                      }
                    }}
                  />
                ))
                ?.reverse()
            : null}
          <Button
            icon={{ name: "add", size: 49, color: theme.colors.secondary }}
            radius={100}
            containerStyle={styles.pointOfInterestButtonContainer}
            // buttonStyle={styles.button}
            onPress={() => setHotButtonDialogVisible(true)}
          />
          <Button
            title={"Undo"}
            onPress={() => {
              dispatch(drawingSlice.actions.undoPestPoint());
            }}
            radius={10}
            containerStyle={{
              ...styles.pointOfInterestButtonContainer,
              alignSelf: "flex-end",
            }}
            buttonStyle={styles.button}
            iconContainerStyle={{ paddingRight: 10 }}
            // containerStyle={{ padding: 5 }}
            // size={"lg"}
            icon={{ name: "undo", size: 49, color: theme.colors.secondary }}
          />
        </View>
      </View>
      <Dialog
        isVisible={hotButtonDialogVisible}
        onDismiss={() => setHotButtonDialogVisible(false)}
        onBackdropPress={() => setHotButtonDialogVisible(false)}
      >
        <ScrollView>
          {getAliasList().map((alias, index) => (
            <ListItem
              key={index}
              onPress={() => {
                dispatch(
                  scoutingSlice.actions.setPestHotButton({
                    Alias: alias,
                    color: alias?.color || "red",
                    type: alias.Type as ObservationTypePrefix,
                  })
                );
                setHotButtonDialogVisible(false);
              }}
            >
              <ListItem.Content>
                <ListItem.Title>{alias.Name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </ScrollView>
      </Dialog>
      {/* <Dialog
        isVisible={settingsDialogVisible}
        onDismiss={() => setSettingsDialogVisible(false)}
        onBackdropPress={() => setSettingsDialogVisible(false)}
      >
        <ScrollView>
          <ListItem
            onPress={() => {
              setDropAtCurrentLocation(!dropAtCurrentLocation);
              setSettingsDialogVisible(false);
            }}
          >
            <ListItem.Content>
              <ListItem.Title>Drop at Current Location</ListItem.Title>
            </ListItem.Content>
            <ListItem.CheckBox checked={dropAtCurrentLocation} />
          </ListItem>
        </ScrollView>
      </Dialog> */}
    </>
  );
};

const getUniqueAliasNames = (observations: Observation[]) => {
  const aliasNamesDict: Record<string, Alias> = {};
  if (!observations) {
    return [];
  }
  observations.forEach((observation) => {
    if (observation.Alias) {
      aliasNamesDict[observation.Alias.Name] = observation.Alias;
    }
  });
  return Object.values(aliasNamesDict);
};

const isSelectedPestHotButton = (
  selectedPestHotButton: PestHotButton | null,
  button: PestHotButton
) => {
  if (!selectedPestHotButton) {
    return false;
  }
  return (
    selectedPestHotButton?.Alias?.Name === button?.Alias?.Name &&
    selectedPestHotButton?.type === button?.type
  );
};
