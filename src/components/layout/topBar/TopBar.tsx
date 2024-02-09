import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { colors } from "../../../styles";
import { useSelector } from "react-redux";

// Data
import { GLOBAL_SELECTIONS_REDUCER_KEY } from "../../../redux/globalSelections/globalSelectionsSlice";
import { RootState } from "../../../redux/store";
export const TopBar = () => {
  const selectedSeason = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].season
  );
  const selectedGrower = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].grower
  );
  const selectedField = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].field
  );

  const handleFieldSelection = () => {
    // Handle field selection logic here
  };

  const handleTimeSelection = () => {
    // Handle time selection logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={handleFieldSelection}
        style={styles.selectionButton}
      >
        <Text style={styles.selectionButtonText}>
          {selectedField || selectedGrower || "Select a Grower / Farm / Field"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleTimeSelection}
        style={styles.selectionButton}
      >
        <Text style={styles.selectionButtonText}>{selectedSeason}</Text>
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
