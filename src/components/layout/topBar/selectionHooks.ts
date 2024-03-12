import { RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  GLOBAL_SELECTIONS_REDUCER_KEY,
  globalSelectionsSlice,
} from "../../../redux/globalSelections/globalSelectionsSlice";
import { Grower, Farm } from "../../../redux/field-management/types";
import { useGetGrowersQuery } from "../../../redux/field-management/fieldManagementApi";

export const useSelectDefaultGlobalSelections = (
  growersData: Grower[] | undefined,
  farmsData: Farm[] | undefined
) => {
  const dispatch = useDispatch();
  const { data: growers } = useGetGrowersQuery("default");
  const globalSelections = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY]
  );
  if (!globalSelections.grower) {
    if (growersData?.[0]) {
      dispatch(globalSelectionsSlice.actions.setGrower(growersData[0]));
    } else if (!globalSelections.farm && farmsData?.[0]) {
      const grower = growers?.find((g) => g.ID === farmsData[0].GrowerId);
      dispatch(
        globalSelectionsSlice.actions.setFarm({
          farm: farmsData[0],
          grower: grower as Grower,
        })
      );
    }
  }

  if (!globalSelections.season) {
    dispatch(globalSelectionsSlice.actions.setSeason("2024"));
  }
};

export const useSelectedGrowerAndFarm = () => {
  const selectedGrower = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].grower
  );
  const selectedFarm = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].farm
  );
  return { selectedGrower, selectedFarm };
};
