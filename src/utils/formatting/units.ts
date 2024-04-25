import type { ScoutingToolUnits } from "../../constants/types";

export const getDisplayUnit = (
  unit1?: ScoutingToolUnits,
  unit2?: ScoutingToolUnits
): string => {
  if (unit1 && unit2) {
    return `${unit1}/${unit2}`;
  } else if (unit1) {
    return unit1;
  }
  return "";
};
