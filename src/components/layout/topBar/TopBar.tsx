import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { colors } from "../../../constants/styles";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, Text, ListItem, Button } from "@rneui/themed";
import { AntDesign } from "@expo/vector-icons";

// Data
import {
  GLOBAL_SELECTIONS_REDUCER_KEY,
  globalSelectionsSlice,
} from "../../../redux/globalSelections/globalSelectionsSlice";
import {
  useGetGrowersQuery,
  useGetFarmsQuery,
} from "../../../redux/field-management/fieldManagementApi";
import { RootState } from "../../../redux/store";
import { Grower, Farm } from "../../../redux/field-management/types";

export const TopBar = () => {
  return (
    <View style={styles.container}>
      <GrowerSelector />
      <FarmSelector />
      {/* <GrowerAndFarmSelector /> */}
      <SeasonSelector />
    </View>
  );
};

const GrowerSelector = () => {
  const dispatch = useDispatch();
  const [isGrowerDialogOpen, setIsGrowerDialogOpen] = useState(false);
  const { data: growers } = useGetGrowersQuery("default", {
    refetchOnReconnect: true,
  });
  const selectedGrower = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].grower
  );
  return (
    <React.Fragment key={"grower-selector-container"}>
      <Button
        title={selectedGrower?.Name || "Select a Grower"}
        titleStyle={styles.selectionButtonText}
        onPress={() => setIsGrowerDialogOpen(true)}
        buttonStyle={styles.selectionButton}
        icon={{ name: "arrow-drop-down" }}
        iconPosition="right"
      >
        <Text style={styles.selectionButtonText}>
          {selectedGrower?.Name || "Select a Grower"}
        </Text>
      </Button>
      <Dialog
        isVisible={isGrowerDialogOpen}
        onBackdropPress={() => setIsGrowerDialogOpen(false)}
      >
        <ScrollView>
          <Dialog.Title title={"Select a Grower"} />
          {growers?.map((grower) => (
            <ListItem
              onPress={() => {
                dispatch(globalSelectionsSlice.actions.setGrower(grower));
                setIsGrowerDialogOpen(false);
              }}
              key={grower.ID}
            >
              <ListItem.Title>{grower.Name}</ListItem.Title>
              {grower.ID === selectedGrower?.ID && <AntDesign name="check" />}
            </ListItem>
          ))}
        </ScrollView>
      </Dialog>
    </React.Fragment>
  );
};

const FarmSelector = () => {
  const dispatch = useDispatch();
  const [isFarmDialogOpen, setIsFarmDialogOpen] = useState(false);
  const { data: farms } = useGetFarmsQuery("default", {
    refetchOnReconnect: true,
  });
  const { data: growers } = useGetGrowersQuery("default", {
    refetchOnReconnect: true,
  });
  const selectedGrower = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].grower
  );
  const selectedFarm = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].farm
  );
  let farmSelectorTitle = selectedFarm?.Name || "Select a Farm";
  if (selectedGrower !== null && !selectedFarm?.Name) {
    farmSelectorTitle = "All Farms";
  }
  return (
    <React.Fragment key={"farm-selector-container"}>
      <Button
        // title={farmSelectorTitle}
        titleStyle={styles.selectionButtonText}
        onPress={() => setIsFarmDialogOpen(true)}
        buttonStyle={styles.selectionButton}
        icon={{ name: "arrow-drop-down" }}
        iconPosition="right"
      >
        <Text style={styles.selectionButtonText}>{farmSelectorTitle}</Text>
      </Button>
      <Dialog
        isVisible={isFarmDialogOpen}
        onBackdropPress={() => setIsFarmDialogOpen(false)}
      >
        <ScrollView>
          <Dialog.Title title={"Select a Farm"} />
          <ListItem
            onPress={() => {
              dispatch(
                globalSelectionsSlice.actions.setFarm({
                  farm: null,
                  grower: selectedGrower as Grower,
                })
              );
              setIsFarmDialogOpen(false);
            }}
          >
            <ListItem.Title>All Farms</ListItem.Title>
            {selectedFarm === null && <AntDesign name="check" />}
          </ListItem>
          {farms
            ?.filter((farm) => farm.GrowerId === selectedGrower?.ID)
            .map((farm) => (
              <ListItem
                onPress={() => {
                  dispatch(
                    globalSelectionsSlice.actions.setFarm({
                      farm,
                      grower: growers?.find(
                        (g) => g.ID === farm.GrowerId
                      ) as Grower,
                    })
                  );
                  setIsFarmDialogOpen(false);
                }}
                key={farm.ID}
              >
                <ListItem.Title>{farm.Name}</ListItem.Title>
                {farm.ID === selectedFarm?.ID && <AntDesign name="check" />}
              </ListItem>
            ))}
        </ScrollView>
      </Dialog>
    </React.Fragment>
  );
};
const SeasonSelector = () => {
  const dispatch = useDispatch();
  const [isSeasonDialogOpen, setIsSeasonDialogOpen] = useState(false);
  const selectedSeason = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].season
  );
  return (
    <React.Fragment key={"season-selector-container"}>
      <Button
        title={selectedSeason || "Select a Season"}
        titleStyle={styles.selectionButtonText}
        onPress={() => setIsSeasonDialogOpen(true)}
        buttonStyle={styles.selectionButton}
        icon={{ name: "arrow-drop-down" }}
        iconPosition="right"
      >
        <Text style={styles.selectionButtonText}>
          {selectedSeason || "Select a Season"}
        </Text>
      </Button>
      <Dialog
        isVisible={isSeasonDialogOpen}
        onBackdropPress={() => setIsSeasonDialogOpen(false)}
      >
        <ScrollView>
          <Dialog.Title title={"Select a Season"} />
          {["2025", "2024", "2023"].map((season) => (
            <ListItem
              onPress={() => {
                dispatch(globalSelectionsSlice.actions.setSeason(season));
                setIsSeasonDialogOpen(false);
              }}
              key={season}
            >
              <ListItem.Title>{season}</ListItem.Title>
            </ListItem>
          ))}
        </ScrollView>
      </Dialog>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 70,
    backgroundColor: colors.primary,
    elevation: 4,
  },
  selectionButton: {
    padding: 16,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  selectionButtonText: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
