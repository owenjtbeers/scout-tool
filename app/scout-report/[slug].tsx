import React from "react";
import { Text } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { CreateScoutingReportPage } from "../../src/components/scouting/CreateScoutingReportPage";
import { useGetScoutReportDetailQuery } from "../../src/redux/scouting/scoutingApi";
import { useGetFieldsQuery } from "../../src/redux/fields/fieldsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";
import { GLOBAL_SELECTIONS_REDUCER_KEY } from "../../src/redux/globalSelections/globalSelectionsSlice";
import { Field } from "../../src/redux/fields/types";
import { ActivityIndicator } from "react-native";

// SideSheet
// Home Page
export default () => {
  const { slug } = useLocalSearchParams();
  // TODO: Fetch scouting report data from API
  const { data, isError, isFetching } = useGetScoutReportDetailQuery(
    {
      id: Number(slug),
    },
    {
      // TODO: Figure out the proper cache policy here
      refetchOnMountOrArgChange: true,
    }
  );

  const globalSelections = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY]
  );

  const { data: fieldResponse, isFetching: isFetchingFields } =
    useGetFieldsQuery({
      growerId: globalSelections?.grower?.ID as number,
      farmId: globalSelections?.farm?.ID as number,
      withBoundaries: true,
    });

  if (isError) {
    return <Text h3>Error fetching scouting report</Text>;
  }

  // @ts-ignore TODO: Fix this
  const field: Field = fieldResponse?.data.find(
    (fieldData) => fieldData.ID === data?.data.FieldIds[0].ID
  ) || {
    Name: "Field is Loading",
    ID: "0",
    ActiveBoundary: { Json: { features: [] } },
    GrowerId: 0,
    FarmId: 0,
  };

  if (isFetchingFields || isFetching) {
    return <ActivityIndicator size="large" />;
  }
  return (
    <CreateScoutingReportPage
      mode={"edit"}
      isFetchingScoutingReport={isFetching || isFetchingFields}
      existingScoutingReport={data?.data}
      fields={[field]}
    />
  );
};
