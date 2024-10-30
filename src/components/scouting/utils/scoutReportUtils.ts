import type {
  ScoutingArea,
  Alias,
  Observation,
  ObservationTypePrefix,
  ScoutingImage,
} from "../../../redux/scouting/types";

import { valueIsDefined } from "../../../utils/valueIsDefined";

export const getNumberOfObservationsFromScoutingArea = (
  scoutingArea: ScoutingArea
): number => {
  return (
    scoutingArea?.WeedObservations?.filter((weedObs) =>
      valueIsDefined(weedObs.value)
    )?.length +
      scoutingArea?.InsectObservations?.filter((insectObs) =>
        valueIsDefined(insectObs.value)
      )?.length +
      scoutingArea?.DiseaseObservations?.filter((diseaseObs) =>
        valueIsDefined(diseaseObs.value)
      )?.length +
      scoutingArea?.GeneralObservations?.filter((generalObs) =>
        valueIsDefined(generalObs.value)
      )?.length || 0
  );
};

export const getNumberOfUniqueAliasesFromScoutingArea = (
  scoutingArea: ScoutingArea
): number => {
  const uniqueAliases = new Set<string>();

  scoutingArea?.WeedObservations?.forEach((weedObs) =>
    uniqueAliases.add(weedObs.Alias.Name)
  );
  scoutingArea?.InsectObservations?.forEach((insectObs) =>
    uniqueAliases.add(insectObs.Alias.Name)
  );
  scoutingArea?.DiseaseObservations?.forEach((diseaseObs) =>
    uniqueAliases.add(diseaseObs.Alias.Name)
  );
  scoutingArea?.GeneralObservations?.forEach((generalObs) =>
    uniqueAliases.add(generalObs.name)
  );

  return uniqueAliases.size;
};

export const getNewWeedObservationSet = (alias: Alias): Observation[] => {
  return [
    {
      Alias: alias,
      questionType: "select",
      name: "Density",
      options: ["Low", "Medium", "High"],
      value: "",
      tags: null,
      ScoutingAreaId: 0,
    },
    {
      Alias: alias,
      questionType: "numeric-slider",
      name: "Height",
      value: "",
      options: ["0", "48"],
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
      tags: null,
      ScoutingAreaId: 0,
    },
  ];
};

export const getNewInsectObservationSet = (alias: Alias): Observation[] => {
  return [
    {
      Alias: alias,
      questionType: "select",
      name: "Severity",
      options: ["Low", "Medium", "High"],
      value: "",
      tags: null,
      ScoutingAreaId: 0,
    },
    {
      Alias: alias,
      questionType: "numeric",
      name: "Count",
      value: "",
      valueUnit1: "insects",
      valueUnit2: "m2",
      tags: null,
      ScoutingAreaId: 0,
    },
  ];
};

export const getNewDiseaseObservationSet = (alias: Alias): Observation[] => {
  return [
    {
      Alias: alias,
      questionType: "select",
      name: "Severity",
      options: ["Low", "Medium", "High"],
      value: "",
      tags: null,
      ScoutingAreaId: 0,
    },
  ];
};

export const getNewGeneralObservation = (questionName: string): Observation => {
  return {
    questionType: "text",
    name: questionName,
    value: "",
    tags: null,
    ScoutingAreaId: 0,
    Alias: { ID: 0, Name: questionName, Type: "General" },
  };
};

export const getObservationSetForAlias = (alias: Alias): Observation[] => {
  let observations = [] as Observation[];
  if (alias.Type) {
    if (alias.Type === "Weed") {
      observations = getNewWeedObservationSet(alias);
    } else if (alias.Type === "Insect") {
      observations = getNewInsectObservationSet(alias);
    } else if (alias.Type === "Disease") {
      observations = getNewDiseaseObservationSet(alias);
    } else if (alias.Type === "General") {
      observations = [getNewGeneralObservation(alias.Name)];
    }
  }
  return observations;
};

export const getMinimumObservationSetForAlias = (alias: Alias): Observation[] => {
  return [{
    questionType: "IGNORE",
    name: "Found",
    value: "",
    tags: null,
    ScoutingAreaId: 0,
    Alias: alias,
  }];
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
  type?: ObservationTypePrefix
): Map<string, number> => {
  const keyMapping = {
    Weed: "WeedObservations",
    Insect: "InsectObservations",
    Disease: "DiseaseObservations",
    General: "GeneralObservations",
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
      let alias;
      if (type === "General") {
        alias = observation?.name;
      } else {
        alias = observation?.Alias?.Name;
      }
      const count = scoutingAreaMap.get(alias || "");
      if (count === undefined && !!alias) {
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

export const createScoutingImageMetadata = (
  observationArea: ScoutingArea,
  typePrefix: ObservationTypePrefix,
  aliasInfo: { ID: number; Name: string },
  questionVal?: Observation
): ScoutingImage => {
  return {
    ID: 0,
    Url: "",
    ObservationAreaUid: observationArea?.UId,
    ObservationAreaId: observationArea?.ID,
    WeedAliasId: typePrefix === "Weed" ? aliasInfo?.ID : 0,
    WeedAlias: typePrefix === "Weed" ? aliasInfo : undefined,
    InsectAliasId: typePrefix === "Insect" ? aliasInfo.ID : 0,
    InsectAlias: typePrefix === "Insect" ? aliasInfo : undefined,
    DiseaseAliasId: typePrefix === "Disease" ? aliasInfo.ID : 0,
    DiseaseAlias: typePrefix === "Disease" ? aliasInfo : undefined,
    Type: typePrefix,
    AddedById: 0,
    QuestionValId:
      typePrefix === "General" && questionVal ? questionVal.ID || 0 : 0,
    QuestionVal:
      typePrefix === "General" && questionVal ? questionVal : undefined,
  };
};

interface ReturnAliasMap {
  Weeds: { [key: string]: Set<string> };
  Diseases: { [key: string]: Set<string> };
  Insects: { [key: string]: Set<string> };
  General: { [key: string]: Set<string> };
}

/*
  This function will be used to get a map for all the unique alias names across all
  passed scouting areas.
  @param scoutingAreas: a list of scouting areas
  @returns a map of Weeds, Diseases, and Insects alias names to their Alias object
*/
export const getAliasesMapForScoutingAreas = (
  scoutingAreas: ScoutingArea[]
): ReturnAliasMap => {
  const aliasMap = {
    Weeds: {},
    Diseases: {},
    Insects: {},
    General: {},
  } as ReturnAliasMap;

  scoutingAreas.forEach((scoutingArea) => {
    if (!scoutingArea) {
      return;
    }
    const {
      WeedObservations,
      DiseaseObservations,
      InsectObservations,
      GeneralObservations,
    } = scoutingArea;
    WeedObservations?.forEach((weedObs) => {
      const { Alias } = weedObs;
      if (aliasMap.Weeds[Alias.Name] === undefined) {
        aliasMap.Weeds[Alias.Name] = new Set([scoutingArea.UId]);
      } else {
        aliasMap.Weeds[Alias.Name].add(scoutingArea.UId);
      }
    });
    DiseaseObservations?.forEach((diseaseObs) => {
      const { Alias } = diseaseObs;
      if (aliasMap.Diseases[Alias.Name] === undefined) {
        aliasMap.Diseases[Alias.Name] = new Set([scoutingArea.UId]);
      } else {
        aliasMap.Diseases[Alias.Name].add(scoutingArea.UId);
      }
    });
    InsectObservations?.forEach((insectObs) => {
      const { Alias } = insectObs;
      if (aliasMap.Insects[Alias.Name] === undefined) {
        aliasMap.Insects[Alias.Name] = new Set([scoutingArea.UId]);
      } else {
        aliasMap.Insects[Alias.Name].add(scoutingArea.UId);
      }
    });
    GeneralObservations?.forEach((generalObs) => {
      if (aliasMap.General[generalObs.name] === undefined) {
        aliasMap.General[generalObs.name] = new Set([scoutingArea.UId]);
      } else {
        aliasMap.General[generalObs.name].add(scoutingArea.UId);
      }
    });
  });

  return aliasMap;
};

export const createGenericObservation = (alias: Alias): Observation => {
  return {
    Alias: alias,
    questionType: "text",
    name: "Found",
    options: [],
    value: "yes",
    tags: null,
    ScoutingAreaId: 0,
  };
};
