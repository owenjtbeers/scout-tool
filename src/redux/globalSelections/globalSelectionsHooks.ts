import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  GLOBAL_SELECTIONS_REDUCER_KEY,
  globalSelectionsSlice,
} from "../../redux/globalSelections/globalSelectionsSlice";
import { Grower, Farm } from "../../redux/field-management/types";

export const useSelectDefaultGlobalSelections = (
  growersData: Grower[] | undefined,
  farmsData: Farm[] | undefined
) => {
  const dispatch = useDispatch();
  const globalSelections = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY]
  );
  if (!globalSelections.grower) {
    if (growersData?.[0]) {
      dispatch(globalSelectionsSlice.actions.setGrower(growersData[0]));
    } else if (!globalSelections.farm && farmsData?.[0]) {
      const grower = growersData?.find((g) => g.ID === farmsData[0].GrowerId);
      dispatch(
        globalSelectionsSlice.actions.setFarm({
          grower: grower as Grower,
          farm: farmsData[0],
        })
      );
    }
  }

  if (!globalSelections.season) {
    // TODO: Get the current season from the server
    dispatch(globalSelectionsSlice.actions.setSeason("2024"));
  }
};
