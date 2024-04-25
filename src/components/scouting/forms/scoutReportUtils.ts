import type {
  ScoutingArea,
  Alias,
  Observation,
} from "../../../redux/scouting/types";

const valueIsDefined = (value: string | number | null | undefined): boolean => {
  if (value === "") {
    return false;
  }
  return value !== null && value !== undefined;
};
export const getNumberOfObservationsFromScoutingArea = (
  scoutingArea: ScoutingArea
): number => {
  return (
    scoutingArea?.weedObservations?.filter((weedObs) =>
      valueIsDefined(weedObs.value)
    )?.length +
      scoutingArea?.insectObservations?.filter((insectObs) =>
        valueIsDefined(insectObs.value)
      )?.length +
      scoutingArea?.diseaseObservations?.filter((diseaseObs) =>
        valueIsDefined(diseaseObs.value)
      )?.length +
      scoutingArea?.generalObservations?.filter((generalObs) =>
        valueIsDefined(generalObs.value)
      )?.length || 0
  );
};

export const getNewWeedObservationSet = (alias: Alias): Observation[] => {
  return [
    {
      Alias: alias,
      questionType: "select",
      name: "Density",
      options: ["Low", "Medium", "High"],
      value: "",
      type: "weed",
      tags: null,
      ScoutingAreaId: 0,
    },
    {
      Alias: alias,
      questionType: "numeric-slider",
      name: "Height",
      value: "",
      options: ["0", "48"],
      type: "weed",
      valueUnit1: "inches",
      // valueUnit2: "m2",
      tags: null,
      ScoutingAreaId: 0,
    },
    {
      Alias: alias,
      questionType: "numeric-slider",
      name: "Diameter",
      value: "",
      options: ["0", "3"],
      type: "weed",
      valueUnit1: "inches",
      // valueUnit2: "m2",
      tags: null,
      ScoutingAreaId: 0,
    },
    {
      Alias: alias,
      questionType: "text",
      name: "Leaf Stage",
      options: [],
      value: "",
      type: "weed",
      tags: null,
      ScoutingAreaId: 0,
    },
  ];
};

/*
  This function is used to get a map of recent observations from a list of scouting areas.
  this will include a count of the number of times that alias has been observed in scouting areas.
  If the alias has been observed multiple times in the same scouting area, it will only be counted once.
  @param observationAreas: a list of scouting areas
  @returns a map of alias names and the number of times they have been observed in the scouting areas
*/
export const getRecentAliasesFromObservations = (
  observationAreas: ScoutingArea[],
  type?: "weed" | "insect" | "disease" | "general"
): Map<string, number> => {
  const keyMapping = {
    weed: "weedObservations",
    insect: "insectObservations",
    disease: "diseaseObservations",
    general: "generalObservations",
  } as { [key: string]: keyof ScoutingArea };
  let keys = Object.values(keyMapping);
  if (type) {
    keys = [keyMapping[type]];
  }
  const recentMap = new Map<string, number>();
  observationAreas.forEach((scoutingArea) => {
    const scoutingAreaMap = new Map<string, number>();
    const filteredObservations = keys.map(
      (key) => scoutingArea[key] as Observation[]
    );

    const recentObservations: Observation[] = [].concat(
      // @ts-ignore TODO: Figure out how to type this properly
      ...filteredObservations
    );
    // We want to create a unique list of the alias names found at this scouting area
    recentObservations.forEach((observation) => {
      const alias = observation.Alias.Name;
      const count = scoutingAreaMap.get(alias);
      if (count === undefined) {
        scoutingAreaMap.set(alias, 1);
      }
    });

    // We want to increment the count of the alias names found at this scouting area
    for (const [alias, _] of scoutingAreaMap.entries()) {
      const recentCount = recentMap.get(alias);
      if (recentCount !== undefined) {
        recentMap.set(alias, recentCount + 1);
      } else {
        recentMap.set(alias, 1);
      }
    }
  });
  return recentMap;
};
