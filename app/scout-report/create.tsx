import React from "react";
import { CreateScoutingReportPage } from "../../src/components/scouting/CreateScoutingReportPage";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";
import { GLOBAL_SELECTIONS_REDUCER_KEY } from "../../src/redux/globalSelections/globalSelectionsSlice";
import { Field } from "../../src/redux/fields/types";

// SideSheet
// Home Page
export default () => {
  const selectedField = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].field
  ) as Field;
  return (
    <CreateScoutingReportPage
      isFetchingScoutingReport={false}
      mode="create"
      fields={[selectedField]}
    />
  );
};

// export default CreateScoutReportHomePage;
