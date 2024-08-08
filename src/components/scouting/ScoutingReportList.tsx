import React from "react";
import { Button, ListItem, Text, useTheme, Tab, TabView } from "@rneui/themed";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";
import { GLOBAL_SELECTIONS_REDUCER_KEY } from "../../redux/globalSelections/globalSelectionsSlice";
import { useGetScoutingReportsQuery } from "../../redux/scouting/scoutingApi";
import { RootState } from "../../redux/store";
import { SCOUT_REPORT_EDIT_SCREEN } from "../../navigation/screens";
import {
  ScoutingReportStatus,
  APIScoutingReport,
} from "../../redux/scouting/types";
import { color } from "@rneui/base";

export const ScoutingReportList: React.FC = () => {
  const { theme } = useTheme();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const season = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].season
  );
  const growerId = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].grower?.ID
  );
  const farmId = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].farm?.ID
  );
  const tabButtonStyle = (active: boolean) => ({
    backgroundColor: active ? theme.colors.secondary : theme.colors.primary,
  });
  const titleStyle = (active: boolean) => ({
    color: active ? theme.colors.primary : theme.colors.secondary,
  });

  const queryParams = {
    growerId: growerId || null,
    farmId: farmId || null,
    start_date: `${season}-01-01`,
    end_date: `${season}-12-31`,
  };
  const { data, error, isLoading, refetch } =
    useGetScoutingReportsQuery(queryParams);
  const onRefresh = React.useCallback(() => {
    refetch();
  }, []);
  const copiedData = data?.data?.slice();
  const sortedData = copiedData?.sort((a, b) => (a.ID - b.ID) * -1);
  return (
    <>
      <Tab
        value={tabIndex}
        onChange={setTabIndex}
        buttonStyle={tabButtonStyle}
        titleStyle={titleStyle}
        variant="primary"
        indicatorStyle={{ backgroundColor: theme.colors.primary }}
      >
        <Tab.Item title={`Draft`} />
        <Tab.Item title="Review" />
        <Tab.Item title="Finished" />
      </Tab>

      <TabView value={tabIndex} onChange={setTabIndex} animationType="spring">
        <TabView.Item style={styles.container}>
          <ScoutingReportListComponent
            key={"scout_list_draft"}
            isLoading={isLoading}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            sortedData={
              sortedData?.filter(
                (scoutingReport) => scoutingReport.Status === "draft"
              ) || []
            }
          />
        </TabView.Item>
        <TabView.Item style={styles.container}>
          <ScoutingReportListComponent
            key={"scout_list_in_review"}
            isLoading={isLoading}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            sortedData={
              sortedData?.filter(
                (scoutingReport) => scoutingReport.Status === "in_review"
              ) || []
            }
          />
        </TabView.Item>
        <TabView.Item style={styles.container}>
          <ScoutingReportListComponent
            isLoading={isLoading}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            sortedData={
              sortedData?.filter(
                (scoutingReport) => scoutingReport.Status === "passed_review"
              ) || []
            }
          />
        </TabView.Item>
      </TabView>
    </>
  );

  // }
};
interface ScoutingReportListComponentProps {
  isLoading: boolean;
  sortedData: APIScoutingReport[];
  isRefreshing: boolean;
  onRefresh: () => void;
}
const ScoutingReportListComponent = (
  props: ScoutingReportListComponentProps
) => {
  const { isLoading, sortedData, isRefreshing, onRefresh } = props;
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      style={styles.container}
    >
      {isLoading && <ActivityIndicator />}
      {sortedData &&
        sortedData.map((scoutingReport) => (
          <ListItem
            containerStyle={{
              maxHeight: 150,
            }}
            bottomDivider
            key={`scout-report-li-${scoutingReport.ID}`}
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
          No scouting reports found with this status:{"\n"}
          Please change the selected grower, farm, season, status filter{"\n"}or
          create a new Scouting Report
        </Text>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    // padding: 2,
    // marginLeft: 100,
    // justifyContent: "center",
    // alignItems: "center",
  },
  emptyText: {
    margin: 20,
  },
});
