import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { colors } from "../../../constants/styles";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, Text, ListItem, Button } from "@rneui/themed";

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
      <GrowerAndFarmSelector />
      <SeasonSelector />
    </View>
  );
};

const GrowerAndFarmSelector = () => {
  const dispatch = useDispatch();
  const [isGrowerFarmDialogOpen, setIsGrowerFarmDialogOpen] = useState(false);
  const selectedGrowerOrFarm = useSelector((state: RootState) => {
    return (
      state[GLOBAL_SELECTIONS_REDUCER_KEY].farm ||
      state[GLOBAL_SELECTIONS_REDUCER_KEY].grower
    );
  });
  // const selectedGrowerOrFarm = { Name: "Test" };
  const { data: growers } = useGetGrowersQuery("default", {
    refetchOnReconnect: true,
  });
  const { data: farms } = useGetFarmsQuery("default", {
    refetchOnReconnect: true,
  });
  const onSelectGrower = (grower: Grower) => () => {
    dispatch(globalSelectionsSlice.actions.setGrower(grower));
    setIsGrowerFarmDialogOpen(false);
  };
  const onSelectFarm = (farm: Farm) => () => {
    const grower = growers?.find((g) => g.ID === farm.GrowerId) as Grower;
    dispatch(globalSelectionsSlice.actions.setFarm({ farm, grower }));
    setIsGrowerFarmDialogOpen(false);
  };

  return (
    <>
      <Button
        title={selectedGrowerOrFarm?.Name || "Select Grower or Farm"}
        titleStyle={styles.selectionButtonText}
        // style={styles.selectionButton
        onPress={() => setIsGrowerFarmDialogOpen(true)}
        buttonStyle={styles.selectionButton}
        icon={{ name: "arrow-drop-down" }}
        iconPosition="right"
        raised
      />
      <Dialog
        isVisible={isGrowerFarmDialogOpen}
        onBackdropPress={() => setIsGrowerFarmDialogOpen(false)}
      >
        <ScrollView>
          <Dialog.Title title={"Select a Grower or Farm"} />
          {growers
            ? growers.reduce((acc, grower: Grower) => {
                acc.push(
                  <ListItem
                    onPress={onSelectGrower(grower)}
                    key={`grower${grower.ID}`}
                    bottomDivider
                  >
                    <ListItem.Title>{`Grower - ${grower.Name}`}</ListItem.Title>
                  </ListItem>
                );
                const farmsForGrower = farms?.filter(
                  (farm) => farm.GrowerId === grower.ID
                );
                farmsForGrower?.forEach((farm) => {
                  acc.push(
                    <ListItem
                      key={`farm${farm.ID}`}
                      onPress={onSelectFarm(farm)}
                    >
                      <ListItem.Title
                        style={{ paddingLeft: 20 }}
                      >{`Farm - ${farm.Name}`}</ListItem.Title>
                    </ListItem>
                  );
                });
                return acc;
              }, [] as JSX.Element[])
            : null}
        </ScrollView>
      </Dialog>
    </>
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
        <Dialog
          isVisible={isSeasonDialogOpen}
          onBackdropPress={() => setIsSeasonDialogOpen(false)}
        >
          <ScrollView>
            <Dialog.Title title={"Select a Season"} />
            {["2024", "2023"].map((season) => (
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
      </Button>
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
