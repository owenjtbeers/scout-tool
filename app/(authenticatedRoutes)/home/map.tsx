import React, { useEffect } from "react";

import {
  useGetFarmsQuery,
  useGetGrowersQuery,
} from "../../../src/redux/field-management/fieldManagementApi";
import { MapScreen } from "../../../src/components/map/Map";
import { useSelectDefaultGlobalSelections } from "../../../src/components/layout/topBar/selectionHooks";
import { useGetCurrentUserQuery } from "../../../src/redux/user/userApi";

export default function Page() {
  const { data: growers } = useGetGrowersQuery("default");
  const { data: farms } = useGetFarmsQuery("default");
  useGetCurrentUserQuery("default");
  useSelectDefaultGlobalSelections(growers, farms);

  return <MapScreen />;
}
