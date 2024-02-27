import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors } from "../../../constants/styles";
import { useSelector, useDispatch } from "react-redux";

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

const defaultSelectionString = "Select a Grower / Farm";
export const TopBar = () => {
  const dispatch = useDispatch();
  const selectedSeason = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].season
  );

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

  const growerFarmFieldPickerRef = useRef<Picker<Grower | string>>(null);
  const seasonPickerRef = useRef<Picker<string | null>>(null);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.selectionButton}
        onPress={() => growerFarmFieldPickerRef?.current?.focus()}
      >
        <Text style={styles.selectionButtonText}>
          {selectedGrowerOrFarm?.Name || defaultSelectionString}
        </Text>
        <Picker
          ref={growerFarmFieldPickerRef}
          selectedValue={selectedGrowerOrFarm || ""}
          onValueChange={(itemValue: Grower | Farm | string) => {
            if (itemValue !== "") {
              if (typeof itemValue !== "string" && "GrowerId" in itemValue) {
                const grower = growers?.find(
                  (g) => g.ID === (itemValue as Farm).GrowerId
                );
                dispatch(
                  globalSelectionsSlice.actions.setFarm({ farm: itemValue as Farm, grower: grower as Grower})
                );
              } else {
                dispatch(
                  globalSelectionsSlice.actions.setGrower(itemValue as Grower)
                );
              }
            }
          }}
        >
          <Picker.Item label={defaultSelectionString} value={""} />
          {growers
            ? growers.reduce((acc, grower: Grower) => {
                acc.push(
                  <Picker.Item
                    label={`Grower - ${grower.Name}`}
                    value={grower}
                    key={`grower${grower.ID}`}
                  />
                );
                const farmsForGrower = farms?.filter(
                  (farm) => farm.GrowerId === grower.ID
                );
                farmsForGrower?.forEach((farm) => {
                  acc.push(
                    <Picker.Item
                      label={`Farm - ${farm.Name}`}
                      value={farm}
                      key={`farm${farm.ID}`}
                    />
                  );
                });
                return acc;
              }, [] as JSX.Element[])
            : null}
          {/* {farms
            ? farms.map((farm) => (
                <Picker.Item label={farm.Name} value={farm} key={farm.ID} />
              ))
            : null} */}
        </Picker>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => seasonPickerRef?.current?.focus()}
        style={styles.selectionButton}
      >
        <Text style={styles.selectionButtonText}>{selectedSeason}</Text>
        <Picker
          ref={seasonPickerRef}
          selectedValue={selectedSeason}
          onValueChange={(itemValue) => {
            dispatch(
              globalSelectionsSlice.actions.setSeason(itemValue as string)
            );
          }}
        >
          <Picker.Item label="Select a Season" value="" />
          <Picker.Item label="2024" value="2024" />
          <Picker.Item label="2023" value="2023" />
        </Picker>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    paddingTop: 60,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 60,
    backgroundColor: colors.primary,
    elevation: 4,
  },
  selectionButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  selectionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
