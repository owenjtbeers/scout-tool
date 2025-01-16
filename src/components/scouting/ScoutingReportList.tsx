import React from "react";
import {
  Button,
  Dialog,
  ListItem,
  Text,
  useTheme,
  Tab,
  TabView,
} from "@rneui/themed";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { GLOBAL_SELECTIONS_REDUCER_KEY } from "../../redux/globalSelections/globalSelectionsSlice";
import {
  useGetScoutingReportsQuery,
  useDeleteScoutingReportMutation,
} from "../../redux/scouting/scoutingApi";
import { RootState } from "../../redux/store";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { SCOUT_REPORT_EDIT_SCREEN } from "../../navigation/screens";
import {
  ScoutingReportStatus,
  APIScoutingReport,
} from "../../redux/scouting/types";
import { color } from "@rneui/base";
import {
  SCOUTING_SLICE_REDUCER_KEY,
  removeDraftedReport,
} from "../../redux/scouting/scoutingSlice";
import { ScoutingReportForm } from "./types";
import alert from "../polyfill/Alert";

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
    grower_id: growerId || null,
    farm_id: farmId || null,
    start_date: `${season}-01-01`,
    end_date: `${season}-12-31`,
  };
  const { data, error, isLoading, refetch } = useGetScoutingReportsQuery(
    queryParams,
    { refetchOnReconnect: true }
  );
  const onRefresh = React.useCallback(() => {
    refetch();
  }, []);
  const draftedReports = useSelector(
    (state: RootState) => state[SCOUTING_SLICE_REDUCER_KEY].draftedReports
  );
  const copiedData = data?.data?.slice();
  const sortedData = copiedData?.sort((a, b) => (a.ID - b.ID) * -1);
  return (
    <View style={styles.container}>
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
          <DraftedScoutingReportListComponent
            key={"scout_list_draft"}
            isLoading={isLoading}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            sortedData={Object.keys(draftedReports).map(
              (key) => draftedReports[key]
            )}
          />
        </TabView.Item>
        <TabView.Item style={styles.container}>
          {tabIndex === 1 && (
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
          )}
        </TabView.Item>
        <TabView.Item style={styles.container}>
          {tabIndex === 2 && (
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
          )}
        </TabView.Item>
      </TabView>
    </View>
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
  const [deleteScoutingReport, { isLoading: isDeleting }] =
    useDeleteScoutingReportMutation();
  const [selectedScoutingReport, setSelectedScoutingReport] =
    React.useState<APIScoutingReport | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
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
            <Button
              icon={{ name: "delete", size: 34, color: theme.colors.secondary }}
              onPress={() => {
                setSelectedScoutingReport(scoutingReport);
                setDeleteDialogVisible(true);
              }}
            />
            <ListItem.Chevron
              size={50}
              color={theme.colors.secondary}
              containerStyle={{ backgroundColor: theme.colors.primary }}
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
      <Dialog isVisible={deleteDialogVisible}>
        <Dialog.Title title={"Delete Scouting Report"}></Dialog.Title>
        {/* <Dialog.Content> */}
        <Text style={{ display: "flex" }}>
          {`Are you sure you want to delete Scouting Report #${selectedScoutingReport?.ID}?`}
        </Text>
        {/* </Dialog.Content> */}
        <Dialog.Actions>
          <Button
            onPress={() => {
              setDeleteDialogVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={async () => {
              setDeleteDialogVisible(false);
              if (selectedScoutingReport && selectedScoutingReport.ID) {
                await deleteScoutingReport({ id: selectedScoutingReport.ID });
              }
            }}
            loading={isDeleting}
          >
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
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

interface DraftedScoutingReportListComponentProps
  extends Omit<ScoutingReportListComponentProps, "sortedData"> {
  sortedData: ScoutingReportForm[];
}

/**
 * This component is used to display the drafted scouting reports, drafted scouting reports
 * do not have the same dataset that the api scouting reports have, so we need to do slightly
 * different things with the data
 *
 * @param props
 * @returns Drafted List Component
 */
const DraftedScoutingReportListComponent = (
  props: DraftedScoutingReportListComponentProps
) => {
  const { isLoading, sortedData, isRefreshing, onRefresh } = props;
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
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
            key={`scout-report-li-${scoutingReport.uniqueDraftID}`}
          >
            <ListItem.Content style={{ flex: 1, flexDirection: "column" }}>
              <ListItem.Title>
                {/* TODO: Needs to be revisited when we do multiple field scouting reports */}
                {`Drafted Report - ${scoutingReport.field.Name}`}
              </ListItem.Title>
              <ListItem.Title right>
                {`${new Date(scoutingReport.scoutedDate).toDateString()}`}
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
                  {`# Areas Scouted: ${
                    scoutingReport.scoutingAreas?.length || 0
                  }`}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem.Content>
            <Button
              icon={{ name: "delete", size: 32, color: theme.colors.secondary }}
              onPress={() => {
                alert(
                  "Delete Drafted Report",
                  "Are you sure you want to delete this drafted report?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      onPress: () => {
                        dispatch(
                          removeDraftedReport(
                            scoutingReport.uniqueDraftID as string
                          )
                        );
                      },
                    },
                  ]
                );
              }}
            />
            <ListItem.Chevron
              size={50}
              color={theme.colors.secondary}
              backgroundColor={theme.colors.primary}
              onPress={() => {
                router.push(
                  SCOUT_REPORT_EDIT_SCREEN.replace(
                    "[slug]",
                    `${scoutingReport.uniqueDraftID}`
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
