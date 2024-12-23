import { DARK_GREEN_PRIMARY } from "../../constants/styles";
import { FieldCrop, OrgCrop } from "./types";

export const getColorForFieldCropSeason = (
  orgCrops: OrgCrop[] | undefined,
  fieldCrops: FieldCrop[],
  season: string | null
) => {
  if (!orgCrops || !fieldCrops?.length) {
    return DARK_GREEN_PRIMARY;
  }

  const selectedSeason = season || new Date().getFullYear().toString();

  // Find first FieldCrop with a planted date in the same year as the selectedSeason
  const cropId = fieldCrops.find((fieldCrop) => {
    const plantedYear = new Date(fieldCrop.PlantedDate)
      .getFullYear()
      .toString();
    return plantedYear === selectedSeason;
  })?.CropId;

  if (!cropId) {
    fieldCrops[0].CropId;
  }
  const orgCrop = orgCrops.find((orgCrop) => orgCrop.ID === cropId);
  if (orgCrop) {
    return orgCrop.Color;
  } else {
    return DARK_GREEN_PRIMARY;
  }
};
/*
  According to react-native guidelines color representations with alpha and hex look like
  '#ff00ff00' (#rrggbbaa) https://reactnative.dev/docs/colors 
*/
export const setOpacityOnHexColor = (hexValue: string) => {
  const opacity = "4D"; // 30% https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4
  let newHexValue = hexValue;
  // Accounting for the # sign
  if (hexValue.length === 7) {
    // Add opacity to the end
    return newHexValue + opacity;
  } else if (hexValue.length === 9) {
    // Case where opacity is already specified
    return newHexValue.substring(0, 7) + opacity;
  }
  return hexValue;
};

/*
  Mapbox does not support colors with opacity in the fill property
*/
export const colorWithoutOpacity = (hexValue: string) => {
  if (hexValue.length === 9) {
    return hexValue.substring(0, 7);
  }
  return hexValue;
};
