import React from "react";
import { Text } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import { CreateScoutingReportPage } from "../../src/components/scouting/CreateScoutingReportPage";
import { useGetScoutReportDetailQuery } from "../../src/redux/scouting/scoutingApi";
import {
  useGetFieldDetailQuery,
  useGetFieldsQuery,
} from "../../src/redux/fields/fieldsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";
import { GLOBAL_SELECTIONS_REDUCER_KEY } from "../../src/redux/globalSelections/globalSelectionsSlice";
import { Field } from "../../src/redux/fields/types";
import { ActivityIndicator } from "react-native";
import { SCOUTING_SLICE_REDUCER_KEY } from "../../src/redux/scouting/scoutingSlice";

// SideSheet
// Home Page

interface CreateScoutingReportPageProps {
  slug: string;
  growerName?: string;
  growerEmail?: string;
  farmName?: string;
  fields: Field[];
}
const DraftedReport = (props: CreateScoutingReportPageProps) => {
  const { growerName, growerEmail, farmName, fields, slug } = props;
  const draftedReports = useSelector(
    (state: RootState) => state[SCOUTING_SLICE_REDUCER_KEY].draftedReports
  );
  const selectedFieldId = draftedReports[slug]?.field?.ID;
  const field = fields.find((fieldData) => selectedFieldId === fieldData.ID);
  return (
    <CreateScoutingReportPage
      mode={"edit"}
      growerEmail={growerEmail}
      growerName={growerName}
      farmName={farmName}
      fields={[draftedReports[slug]?.field as Field]}
      isFetchingScoutingReport={false}
      draftedReportKey={slug}
    />
  );
};

const ServerReport = (props: CreateScoutingReportPageProps) => {
  const { growerName, growerEmail, farmName, fields } = props;
  const { data, isError, isFetching, isLoading } = useGetScoutReportDetailQuery(
    {
      id: Number(props.slug),
    },
    {
      // TODO: Figure out the proper cache policy here
      refetchOnMountOrArgChange: true,
    }
  );
  if (isError) {
    return <Text h3>Error fetching scouting report</Text>;
  }

  if (isFetching || isLoading) {
    return <ActivityIndicator size="large" />;
  }

  const selectedFieldId = data?.data?.FieldIds?.[0]?.ID;
  const field = fields.find((fieldData) => selectedFieldId === fieldData.ID);
  return (
    <CreateScoutingReportPage
      mode={"edit"}
      isFetchingScoutingReport={isFetching}
      existingScoutingReport={data?.data}
      growerName={growerName}
      growerEmail={growerEmail}
      farmName={farmName}
      fields={[field as Field]}
    />
  );
};
export default () => {
  const { slug } = useLocalSearchParams();
  const stringifiedSlug = String(slug);

  const globalSelections = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY]
  );
  console.log("globalSelections", globalSelections);
  // TODO: This is very excessive and way too expensive
  const {
    data: fieldResponse,
    isFetching: isFetchingFields,
    isLoading: isLoadingFields,
  } = useGetFieldsQuery({
    growerId: globalSelections?.grower?.ID as number,
    farmId: globalSelections?.farm?.ID as number,
    withBoundaries: true,
    withCrops: true,
  });

  if (isFetchingFields || isLoadingFields) {
    return <ActivityIndicator size="large" />;
  }

  if (fieldResponse?.data?.length === 0) {
    return <Text h3>No fields found</Text>;
  }

  if (isSlugDraft(stringifiedSlug)) {
    return (
      <DraftedReport
        growerEmail={globalSelections?.grower?.Email}
        growerName={globalSelections?.grower?.Name}
        farmName={globalSelections?.farm?.Name}
        fields={fieldResponse?.data}
        slug={stringifiedSlug}
      />
    );
  } else {
    return (
      <ServerReport
        growerEmail={globalSelections?.grower?.Email}
        growerName={globalSelections?.grower?.Name}
        farmName={globalSelections?.farm?.Name}
        fields={fieldResponse?.data}
        slug={stringifiedSlug}
      />
    );
  }
};

const isSlugDraft = (slug: string) => {
  return String(slug).includes("-");
};
