import React from "react";
import { Text } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
// import { CreateScoutingReportPage } from "../../src/components/fields/EditFieldHistoryPage";
// import { useGetFieldDetailQuery, useGetFieldsQuery } from "../../../../src/redux/fields/fieldsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../src/redux/store";
import { Field } from "../../../../src/redux/fields/types";
import { ActivityIndicator } from "react-native";

// SideSheet
// Home Page
export default () => {
  return <></>;
  // const { slug } = useLocalSearchParams();

  // const { data: fieldResponse, isFetching: isFetchingField } = useGetFieldQuery(
  //   {
  //     id: Number(slug),
  //   }
  // );

  // if (isError) {
  //   return <Text h3>Error fetching crop history</Text>;
  // }

  // // @ts-ignore TODO: Fix this
  // const field: Field = fieldResponse?.data.find(
  //   (fieldData) => fieldData.ID === data?.data.FieldIds[0].ID
  // ) || {
  //   Name: "Field is Loading",
  //   ID: "0",
  //   ActiveBoundary: { Json: { features: [] } },
  //   GrowerId: 0,
  //   FarmId: 0,
  // };

  // if (isFetchingField || isFetching) {
  //   return <ActivityIndicator size="large" />;
  // }
  // return (
  //   <CreateScoutingReportPage
  //     mode={"edit"}
  //     isFetchingScoutingReport={isFetching || isFetchingFields}
  //     existingScoutingReport={data?.data}
  //     fields={[field]}
  //   />
  // );
};
