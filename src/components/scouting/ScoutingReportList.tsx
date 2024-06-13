import React from "react";
import { ListItem, Text, useTheme } from "@rneui/themed";
import { useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { GLOBAL_SELECTIONS_REDUCER_KEY } from "../../redux/globalSelections/globalSelectionsSlice";
import { useGetScoutingReportsQuery } from "../../redux/scouting/scoutingApi";
import { RootState } from "../../redux/store";
import { SCOUT_REPORT_EDIT_SCREEN } from "../../navigation/screens";

export const ScoutingReportList: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const season = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].season
  );
  const growerId = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].grower?.ID
  );
  const farmId = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].farm?.ID
  );

  const { data, error, isLoading } = useGetScoutingReportsQuery({
    growerId: growerId || null,
    farmId: farmId || null,
    start_date: `${season}-01-01`,
    end_date: `${season}-12-31`,
  });

  const copiedData = data?.data?.slice();
  const sortedData = copiedData?.sort((a, b) => (a.ID - b.ID) * -1);
  return (
    <ScrollView style={styles.container}>
      {isLoading && <ActivityIndicator />}
      {sortedData &&
        sortedData.map((scoutingReport) => (
          <ListItem
            containerStyle={
              {
                // flexDirection: "column",
                // flex: 1,
                // maxHeight: 500,
              }
            }
            bottomDivider
            key={scoutingReport.ID}
          >
            <ListItem.Content style={{ flex: 1, flexDirection: "column" }}>
              <ListItem.Title>
                {`Report #${scoutingReport.ID} - ${scoutingReport.FieldIds.map(
                  (obj) => obj.Name
                ).join(",")}`}{" "}
              </ListItem.Title>
              <ListItem.Title right>
                {`${new Date(scoutingReport.ScoutedDate).toDateString()}`}
              </ListItem.Title>
              <ListItem.Content
                style={{
                  flex: 0,
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <ListItem.Subtitle>
                  {`By: ${scoutingReport.ScoutedBy?.FirstName}`}
                </ListItem.Subtitle>
                <ListItem.Subtitle>
                  {`# Areas Scouted: ${
                    scoutingReport.ObservationAreas?.length || 0
                  }`}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem.Content>
            <ListItem.Chevron
              size={50}
              color={theme.colors.secondary}
              backgroundColor={theme.colors.primary}
              onPress={() => {
                router.push(
                  SCOUT_REPORT_EDIT_SCREEN.replace(
                    "[slug]",
                    `${scoutingReport.ID}`
                  )
                );
              }}
            />
          </ListItem>
        ))}
      {!isLoading && !sortedData?.length && (
        <Text h4 style={styles.emptyText}>
          No scouting reports found:{"\n"}
          Please change the selected grower, farm, season{"\n"}or create a new
          Scouting Report
        </Text>
      )}
    </ScrollView>
  );

  // }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  emptyText: {
    margin: 20,
  },
});
