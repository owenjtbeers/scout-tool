import { RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  GLOBAL_SELECTIONS_REDUCER_KEY,
  globalSelectionsSlice,
} from "../../../redux/globalSelections/globalSelectionsSlice";
import { Grower, Farm } from "../../../redux/field-management/types";

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
      dispatch(globalSelectionsSlice.actions.setFarm(farmsData[0]));
    }
  }

  if (!globalSelections.season) {
    dispatch(globalSelectionsSlice.actions.setSeason("2024"));
  }
};
