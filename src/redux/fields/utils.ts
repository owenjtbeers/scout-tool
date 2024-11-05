import { FieldCrop } from "../crops/types";

export const getMostRecentCrop = (fieldCrops: FieldCrop[]) => {
  // Grab the first crop that has the most recent planted date
  const sortedCrops = [...fieldCrops];
  sortedCrops.sort((a, b) => {
    return (
      new Date(b.PlantedDate).getTime() - new Date(a.PlantedDate).getTime()
    );
  });
  return sortedCrops?.[0];
};
