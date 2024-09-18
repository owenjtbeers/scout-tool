import type {
  ScoutingArea,
  Alias,
  Observation,
  ObservationTypePrefix,
  APIObservationArea,
  APIScoutingReport,
  ScoutingImage,
} from "../../../redux/scouting/types";
import { ScoutingAppUser } from "../../../redux/user/types";
import type { ScoutingReportForm } from "../types";

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
    Alias: { ID: 0, Name: questionName },
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

export const mapFormDataToPostScoutReport = (
  scoutReportForm: ScoutingReportForm,
  currentUser?: ScoutingAppUser
): APIScoutingReport => {
  const {
    summaryText,
    scoutingAreas,
    fieldIds,
    scoutedById,
    scoutedDate,
    recommendations,
    growthStage,
  } = scoutReportForm;
  return {
    ID: scoutReportForm.ID || 0,
    // TODO: Record the date properly through the UI
    ScoutedDate: scoutedDate.toISOString(),
    // TODO: Record the scouted by properly through the UI
    ScoutedById: scoutedById || currentUser?.ID || 0,
    Summary: summaryText,
    Recommendation: recommendations,
    GrowthStage: growthStage,
    Fields: fieldIds,
    // @ts-ignore TODO: Type this better. The input type to the api is not the same as the output type
    ObservationAreas: scoutingAreas.map((scoutingArea) => {
      return {
        ID: scoutingArea.ID,
        UId: scoutingArea.UId,
        ScoutReportId: scoutingArea.ScoutReportId,
        Geometry: scoutingArea.Geometry,
        WeedObservations: mapScoutingAreaObservationsToAPITypeObservation(
          scoutingArea.WeedObservations
        ),
        InsectObservations: mapScoutingAreaObservationsToAPITypeObservation(
          scoutingArea.InsectObservations
        ),
        DiseaseObservations: mapScoutingAreaObservationsToAPITypeObservation(
          scoutingArea.DiseaseObservations
        ),
        GeneralObservations: scoutingArea.GeneralObservations.map(
          mapFormObservationToAPIQuestionVal
        ),
      };
    }),
    Images: scoutReportForm.images,
    Crop: scoutReportForm.crop,
    Status: scoutReportForm.status,
  };
};

const mapScoutingAreaObservationsToAPITypeObservation = (
  observations: Observation[]
) => {
  // Group the observations by alias
  const aliasMap = observations.reduce((acc, observation) => {
    const { Alias } = observation;
    if (!Alias) {
      return acc;
    }
    if (!acc[Alias.Name]) {
      acc[Alias.Name] = { ID: Alias.ID, observations: [] as Observation[] };
    }
    acc[Alias.Name].observations.push(observation);
    return acc;
  }, {} as Record<string, { ID: number; observations: Observation[] }>);

  // Map the grouped observations to the API format
  return Object.keys(aliasMap).map((aliasName) => {
    const alias = aliasMap[aliasName];
    return {
      AliasName: aliasName,
      AliasId: alias.ID,
      QuestionVals: alias.observations
        .map(mapFormObservationToAPIQuestionVal)
        .filter((questionVal) => valueIsDefined(questionVal.Value)),
    };
  });
};

export const convertObservationAreasToScoutingAreas = (
  observationAreas: APIObservationArea[] | undefined
): ScoutingArea[] => {
  if (!observationAreas) {
    return [];
  }
  const returnVal = observationAreas.map((observationArea) => {
    return {
      ID: observationArea.ID,
      UId: observationArea.UId,
      ScoutReportId: observationArea.ScoutReportId,
      // @ts-ignore
      Geometry: observationArea.Geometry.Json,
      WeedObservations: observationArea.WeedObservations.map((weedObs) => {
        return weedObs.WeedQuestionVals.map((weedQuestionVal) => {
          const questionVal = weedQuestionVal.QuestionVal;
          return {
            ID: questionVal.ID,
            Alias: {
              ID: weedObs.WeedAliasId,
              Name: weedObs.WeedAlias.Name,
            },
            questionType: questionVal.RenderType,
            name: questionVal.Question,
            options: questionVal.Options.split(","),
            value: questionVal.Value,
            tags: null,
            ScoutingAreaId: observationArea.ID,
          } as Observation;
        });
      }).flat(),
      InsectObservations: observationArea.InsectObservations.map(
        (insectObs) => {
          return insectObs.InsectQuestionVals.map((insectQuestionVal) => {
            const questionVal = insectQuestionVal.QuestionVal;
            return {
              ID: questionVal.ID,
              Alias: {
                ID: insectObs.InsectAliasId,
                Name: insectObs.InsectAlias.Name,
              },
              questionType: questionVal.RenderType,
              name: questionVal.Question,
              options: questionVal.Options.split(","),
              value: questionVal.Value,
              tags: null,
              ScoutingAreaId: observationArea.ID,
            } as Observation;
          });
        }
      ).flat(),
      DiseaseObservations: observationArea.DiseaseObservations.map(
        (diseaseObs) => {
          return diseaseObs.DiseaseQuestionVals.map((diseaseQuestionVal) => {
            const questionVal = diseaseQuestionVal.QuestionVal;
            return {
              ID: questionVal.ID,
              Alias: {
                ID: diseaseObs.DiseaseAliasId,
                Name: diseaseObs.DiseaseAlias.Name,
              },
              questionType: questionVal.RenderType,
              name: questionVal.Question,
              options: questionVal.Options.split(","),
              valueUnit1: questionVal.ValueUnit1,
              valueUnit2: questionVal.ValueUnit2,
              value: questionVal.Value,
              tags: null,
              ScoutingAreaId: observationArea.ID,
            } as Observation;
          });
        }
      ).flat(),
      // InsectObservations: observationArea.InsectObservations,
      // DiseaseObservations: observationArea.DiseaseObservations,
      GeneralObservations: observationArea.GeneralObservations.map(
        (generalQuestionVal) => {
          return {
            ID: generalQuestionVal.ID,
            Alias: { ID: 0, Name: "" },
            questionType: generalQuestionVal.RenderType,
            name: generalQuestionVal.Question,
            options: generalQuestionVal.Options.split(","),
            value: generalQuestionVal.Value,
            tags: null,
            ScoutingAreaId: observationArea.ID,
          };
        }
      ),
    } as ScoutingArea;
  });

  const mainAreas = returnVal.filter(
    (observationArea) => observationArea.Type === "Main"
  );
  return returnVal;
};

const mapFormObservationToAPIQuestionVal = (observation: Observation) => {
  return {
    ID: observation.ID || 0,
    Question: observation.name,
    Value: String(observation.value),
    Options: observation.options?.join(","),
    RenderType: observation.questionType,
    ValueUnit1: observation.valueUnit1,
    ValueUnit2: observation.valueUnit2,
  };
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
    const {
      WeedObservations,
      DiseaseObservations,
      InsectObservations,
      GeneralObservations,
    } = scoutingArea;
    WeedObservations.forEach((weedObs) => {
      const { Alias } = weedObs;
      if (aliasMap.Weeds[Alias.Name] === undefined) {
        aliasMap.Weeds[Alias.Name] = new Set([scoutingArea.UId]);
      } else {
        aliasMap.Weeds[Alias.Name].add(scoutingArea.UId);
      }
    });
    DiseaseObservations.forEach((diseaseObs) => {
      const { Alias } = diseaseObs;
      if (aliasMap.Diseases[Alias.Name] === undefined) {
        aliasMap.Diseases[Alias.Name] = new Set([scoutingArea.UId]);
      } else {
        aliasMap.Diseases[Alias.Name].add(scoutingArea.UId);
      }
    });
    InsectObservations.forEach((insectObs) => {
      const { Alias } = insectObs;
      if (aliasMap.Insects[Alias.Name] === undefined) {
        aliasMap.Insects[Alias.Name] = new Set([scoutingArea.UId]);
      } else {
        aliasMap.Insects[Alias.Name].add(scoutingArea.UId);
      }
    });
    GeneralObservations.forEach((generalObs) => {
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
